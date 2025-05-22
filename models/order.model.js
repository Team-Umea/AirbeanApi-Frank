import pool from "../config/db.js";

export const dbCreateOrder = async (cart, account_id) => {
  // Start a transaction to ensure data consistency
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // First get current prices for all products in the cart
    console.log('cart here!!!',cart);
    const productIds = cart.items.map(item => item.item_id);

    console.log('productIds', productIds);
    const priceResult = await client.query(
      `SELECT id, product_price FROM product WHERE id = ANY($1)`,
      [productIds]
    );
    console.log('priceResult', priceResult);
    const currentPrices = Object.fromEntries(
      priceResult.rows.map(row => [row.id, row.product_price])
    );
    console.log('currentPrices', currentPrices);
    const result = await client.query(
      `INSERT INTO "order" (account_id, order_sum, status, created_at)
       VALUES ($1, $2, 'pending', CURRENT_TIMESTAMP) 
       RETURNING *`,
      [account_id, cart.cart_sum]
    );

    console.log('result!!!', result);
    const order = result.rows[0];

    console.log('order', order);
    console.log('cart.items:', cart.items);
    // Batch insert order products with current prices for historical record
    const values = cart.items.map((item, i) => 
      `($1, $${i*3 + 2}, $${i*3 + 3}, $${i*3 + 4})`
    ).join(', ');
    
    console.log('values', values);

    const params = [order.id];
    cart.items.forEach(item => {
      params.push(
        item.product_id, 
        item.quantity,
        currentPrices[item.product_id] // Store current price at time of order
      );
    });

    await client.query(
      `INSERT INTO order_products (order_id, product_id, quantity, product_price)
       VALUES ${values}`,
      params
    );

    await client.query('COMMIT');
    return order;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const dbOrderHistory = async (userId) => {
  const result = await pool.query(
    `WITH order_details AS (
      SELECT 
        o.*,
        json_agg(
          json_build_object(
            'product_id', op.product_id,
            'quantity', op.quantity,
            'name', p.product_name,
            'current_price', p.product_price,
            'ordered_price', op.product_price,
            'total_price', op.product_price * op.quantity
          ) ORDER BY p.product_name
        ) as items
      FROM "order" o
      LEFT JOIN order_products op ON o.id = op.order_id
      LEFT JOIN product p ON op.product_id = p.id
      WHERE o.account_id = $1
      GROUP BY o.id
    )
    SELECT 
      od.*,
      COALESCE(
        (SELECT SUM(item->>'total_price')::numeric 
         FROM jsonb_array_elements(od.items::jsonb) item),
        0
      ) as calculated_total
    FROM order_details od
    ORDER BY od.created_at DESC`,
    [userId]
  );
  return result.rows;
};

export const dbGetOrder = async (orderId) => {
  const result = await pool.query(
    `WITH order_details AS (
      SELECT 
        o.*,
        json_agg(
          json_build_object(
            'product_id', op.product_id,
            'quantity', op.quantity,
            'name', p.product_name,
            'current_price', p.product_price,
            'ordered_price', op.product_price,
            'total_price', op.product_price * op.quantity
          ) ORDER BY p.product_name
        ) as items
      FROM "order" o
      LEFT JOIN order_products op ON o.id = op.order_id
      LEFT JOIN product p ON op.product_id = p.id
      WHERE o.id = $1
      GROUP BY o.id
    )
    SELECT 
      od.*,
      COALESCE(
        (SELECT SUM(item->>'total_price')::numeric 
         FROM jsonb_array_elements(od.items::jsonb) item),
        0
      ) as calculated_total
    FROM order_details od`,
    [orderId]
  );
  return result.rows[0];
};

// SQL to create necessary indexes (should be run during database setup):
/*
CREATE INDEX IF NOT EXISTS idx_order_account_id ON "order"(account_id);
CREATE INDEX IF NOT EXISTS idx_order_status ON "order"(status);
CREATE INDEX IF NOT EXISTS idx_order_created_at ON "order"(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_products_order_id ON order_products(order_id);
CREATE INDEX IF NOT EXISTS idx_order_products_product_id ON order_products(product_id);
*/
