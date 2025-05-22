import pool from "../config/db.js";

// Create order + order_products
export const dbCreateOrder = async (cart) => {
  const result = await pool.query(
    `INSERT INTO "order" (account_id, order_sum, delivery_time, status)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [cart.account_id, cart.cart_sum, "20 minutes", "pending"]
  );
  const order = result.rows[0];

  const cartItems = await pool.query(
    `SELECT product_id, quantity FROM cart_items WHERE cart_id = $1`,
    [cart.id]
  );

  for (const item of cartItems.rows) {
    await pool.query(
      `INSERT INTO order_products (order_id, product_id, quantity)
       VALUES ($1, $2, $3)`,
      [order.id, item.product_id, item.quantity]
    );
  }

  return order;
};

// Get status + remaining delivery time
export const dbGetOrderStatus = async (orderId) => {
  const result = await pool.query(
    `SELECT 
       id AS order_id,
       status,
       delivery_time,
       created_at,
       (created_at + delivery_time - NOW()) AS time_remaining
     FROM "order"
     WHERE id = $1`,
    [orderId]
  );

  return result.rows[0];
};

// Get order history for a user
export const dbOrderHistory = async (userId) => {
  const result = await pool.query(
    `SELECT id AS order_id, order_sum, created_at
     FROM "order"
     WHERE customer_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
};
