import pool from "./db.js";
//För att skapa alla våra tables i databasen när man startar index.js
const createTables = async () => {
  try {
    await pool.query(`
      -- Enable UUID extension
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      -- Account table
      CREATE TABLE IF NOT EXISTS account (
        id SERIAL PRIMARY KEY,
        profile_picture TEXT,
        firstname VARCHAR(50) NOT NULL,
        surname VARCHAR(50) NOT NULL,
        phone_number VARCHAR(20) UNIQUE NOT NULL,
        address VARCHAR(100) NOT NULL,
        post_number VARCHAR(50) NOT NULL,
        city VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(100) NOT NULL,
        account_id UUID UNIQUE DEFAULT uuid_generate_v4() NOT NULL,
        role TEXT DEFAULT 'user' NOT NULL CHECK (role IN ('user', 'admin')),
        reset_token TEXT,
        reset_token_expires TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );

      -- Product table
      CREATE TABLE IF NOT EXISTS product (
        id SERIAL PRIMARY KEY,
        product_name VARCHAR(100) NOT NULL,
        product_price DECIMAL(10,2) NOT NULL CHECK (product_price >= 0),
        product_info TEXT,
        product_stock INTEGER NOT NULL DEFAULT 0 CHECK (product_stock >= 0),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );

      -- Order table
      CREATE TABLE IF NOT EXISTS "order" (
        id SERIAL PRIMARY KEY,
        account_id UUID REFERENCES account(account_id) ON DELETE CASCADE NOT NULL,
        order_sum DECIMAL(10,2) NOT NULL CHECK (order_sum >= 0),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        status VARCHAR(50) DEFAULT 'pending' NOT NULL 
          CHECK (status IN ('pending', 'preparing', 'delivering', 'delivered')),
        estimated_delivery TIMESTAMP,
        actual_delivery TIMESTAMP
      );

      -- Order products table
      CREATE TABLE IF NOT EXISTS order_products (
        id SERIAL PRIMARY KEY,
        order_id INT REFERENCES "order"(id) ON DELETE CASCADE NOT NULL,
        product_id INT REFERENCES product(id) ON DELETE RESTRICT NOT NULL,
        quantity INTEGER NOT NULL CHECK (quantity > 0),
        product_price DECIMAL(10,2) NOT NULL CHECK (product_price >= 0),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );

      -- Cart table
      CREATE TABLE IF NOT EXISTS cart (
        id SERIAL PRIMARY KEY,
        cart_sum DECIMAL(10,2) DEFAULT 0.00 NOT NULL CHECK (cart_sum >= 0),
        account_id UUID REFERENCES account(account_id) ON DELETE CASCADE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '24 hours') NOT NULL
      );

      -- Cart items table
      CREATE TABLE IF NOT EXISTS cart_items (
        id SERIAL PRIMARY KEY,
        cart_id INT REFERENCES cart(id) ON DELETE CASCADE NOT NULL,
        product_id INT REFERENCES product(id) ON DELETE CASCADE NOT NULL,
        quantity INTEGER NOT NULL CHECK (quantity > 0),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        UNIQUE(cart_id, product_id)
      );

      -- Create indexes for better performance
      CREATE INDEX IF NOT EXISTS idx_order_account_id ON "order"(account_id);
      CREATE INDEX IF NOT EXISTS idx_order_status ON "order"(status);
      CREATE INDEX IF NOT EXISTS idx_order_created_at ON "order"(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_order_products_order_id ON order_products(order_id);
      CREATE INDEX IF NOT EXISTS idx_order_products_product_id ON order_products(product_id);
      CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
      CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);
      CREATE INDEX IF NOT EXISTS idx_account_email ON account(email);
      CREATE INDEX IF NOT EXISTS idx_account_role ON account(role);

      -- Create function to update updated_at timestamp
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql';

      -- Create triggers for updated_at
      DROP TRIGGER IF EXISTS update_account_updated_at ON account;
      CREATE TRIGGER update_account_updated_at
          BEFORE UPDATE ON account
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();

      DROP TRIGGER IF EXISTS update_product_updated_at ON product;
      CREATE TRIGGER update_product_updated_at
          BEFORE UPDATE ON product
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();

      DROP TRIGGER IF EXISTS update_cart_updated_at ON cart;
      CREATE TRIGGER update_cart_updated_at
          BEFORE UPDATE ON cart
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();

      -- Create function to clean up expired carts
      CREATE OR REPLACE FUNCTION cleanup_expired_carts()
      RETURNS void AS $$
      BEGIN
          DELETE FROM cart WHERE expires_at < CURRENT_TIMESTAMP;
      END;
      $$ LANGUAGE plpgsql;
    `);

    console.log("All tables, indexes, and triggers created successfully");
  } catch (error) {
    console.error("Error creating database schema:", error);
    throw error;
  }
};

export default createTables;