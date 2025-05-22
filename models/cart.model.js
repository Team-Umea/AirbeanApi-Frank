import pool from "../config/db.js";

// Skapa en ny kundvagn
export const dbCreateCart = async (customer_id) => {
  const result = await pool.query(
    `INSERT INTO cart (customer_id, cart_sum)
     VALUES ($1, 0.00)
     RETURNING id`,
    [customer_id]
  );
  return result.rows[0].id;
};

// Lägg till en produkt i en kundvagn
export const dbAddItemToCart = async (cartId, productId, quantity) => {
  const productResult = await pool.query(
    "SELECT product_price FROM product WHERE id = $1",
    [productId]
  );
  const price = productResult.rows[0].product_price;

  await pool.query(
    `INSERT INTO cart_items (cart_id, product_id, quantity)
     VALUES ($1, $2, $3)`,
    [cartId, productId, quantity]
  );

  await pool.query(
    `UPDATE cart
     SET cart_sum = cart_sum + $1
     WHERE id = $2`,
    [price * quantity, cartId]
  );
};

// Hämta innehållet i en kundvagn
export const dbGetCart = async (cartId) => {
  const itemsResult = await pool.query(
    `SELECT cart_items.id AS item_id,
            product.product_name,
            cart_items.quantity,
            product.product_price
     FROM cart_items
     JOIN product ON cart_items.product_id = product.id
     WHERE cart_items.cart_id = $1`,
    [cartId]
  );

  const cartResult = await pool.query(
    `SELECT cart_sum FROM cart WHERE id = $1`,
    [cartId]
  );

  return {
    cart_sum: cartResult.rows[0]?.cart_sum || 0,
    items: itemsResult.rows,
  };
};

// Ta bort en produkt från en kundvagn
export const dbRemoveItemFromCart = async (cartId, itemId) => {
  const priceResult = await pool.query(
    `SELECT cart_items.quantity, product.product_price
     FROM cart_items
     JOIN product ON cart_items.product_id = product.id
     WHERE cart_items.id = $1 AND cart_items.cart_id = $2`,
    [itemId, cartId]
  );

  if (priceResult.rows.length === 0) return;

  const { quantity, product_price } = priceResult.rows[0];

  await pool.query(`DELETE FROM cart_items WHERE id = $1 AND cart_id = $2`, [
    itemId,
    cartId,
  ]);

  await pool.query(
    `UPDATE cart
     SET cart_sum = cart_sum - $1
     WHERE id = $2`,
    [product_price * quantity, cartId]
  );
};
