import pool from "../config/db.js";

//hämta menyn från db
export const dbGetItems = async () => {
  const result = await pool.query(
    `SELECT product_name,product_price,product_info,product_stock FROM product`
  );
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
