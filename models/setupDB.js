import pool from "./db.js";
//För att skapa alla våra tables i databasen när man startar index.js
const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS account (
        id SERIAL PRIMARY KEY,
        profile_picture TEXT,
        firstname VARCHAR(50),
        surname VARCHAR(50),
        phone_number VARCHAR(20) UNIQUE,
        adress VARCHAR(100),
        post_number VARCHAR(50),
        city VARCHAR(50),
        email VARCHAR(100) UNIQUE,
        password_hash VARCHAR(100),
        role TEXT DEFAULT 'user'
      );

      CREATE TABLE IF NOT EXISTS product (
        id SERIAL PRIMARY KEY,
        product_name VARCHAR(100),
        product_price DECIMAL(10,2),
        product_info TEXT,
        product_stock INTEGER
      );

      CREATE TABLE IF NOT EXISTS "order" (
        id SERIAL PRIMARY KEY,
        customer_id INT REFERENCES account(id),
        order_sum DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS order_products (
        id SERIAL PRIMARY KEY,
        order_id INT REFERENCES "order"(id),
        product_id INT REFERENCES product(id),
        quantity INTEGER,
        product_price DECIMAL(10,2)
      );

      CREATE TABLE IF NOT EXISTS cart (
        id SERIAL PRIMARY KEY,
        customer_id INT REFERENCES account(id),
        created_at TIMESTAMP DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS cart_items (
        id SERIAL PRIMARY KEY,
        cart_id INT REFERENCES cart(id),
        product_id INT REFERENCES product(id),
        quantity INTEGER
      );
    `);

    console.log("✅ Alla tabeller skapades (om de inte redan fanns).");
  } catch (error) {
    console.error("❌ Fel vid skapande av tabeller:", error);
  }
};

export default createTables;
