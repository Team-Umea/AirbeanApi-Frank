import pool from "../config/db.js";

//hämta menyn från db
export const dbGetItems = async () => {
  const result = await pool.query(`SELECT * FROM product`);
  return result.rows;
};

export const dbAddItem = async (name, price, info, stock) => {
  const insertedProduct = await pool.query(
    `INSERT INTO product (product_name, product_price, product_info, product_stock)
        VALUES ($1, $2, $3, $4) RETURNING *`,
    [name, price, info, stock]
  );
  return insertedProduct.rows[0];
};

export const dbDeletedItem = async (productId) => {
  console.log("Deleting product with id:", productId);
  const result = await pool.query(
    `
    DELETE FROM product WHERE id = $1 RETURNING *`,
    [productId]
  );
  return result.rows[0];
};
export const dbUpdatedItem = async (productId, name, price, info) => {
  const result = await pool.query(
    `UPDATE product
     SET product_name = $1,
         product_price = $2,
         product_info = $3
     WHERE id = $4
     RETURNING *`,
    [name, price, info, productId]
  );
  return result.rows[0];
};
