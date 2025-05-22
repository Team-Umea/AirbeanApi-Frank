import pool from "../config/db.js";

export const validateCartProducts = async (req, res, next) => {
  try {
    const { cartId } = req.body;
    
    // Get cart items
    const cartResult = await pool.query(
      `SELECT ci.product_id, ci.quantity, p.product_price, p.product_stock
       FROM cart_items ci
       JOIN product p ON ci.product_id = p.id
       WHERE ci.cart_id = $1`,
      [cartId]
    );

    if (cartResult.rows.length === 0) {
      return res.status(400).json({ error: "Cart is empty or contains invalid products" });
    }

    // Validate each product
    for (const item of cartResult.rows) {
      // Check if product exists and has sufficient stock
      if (item.product_stock < item.quantity) {
        return res.status(400).json({ 
          error: `Insufficient stock for product ID ${item.product_id}`,
          available: item.product_stock,
          requested: item.quantity
        });
      }
    }

    // Calculate total and verify against cart sum
    const cartSum = cartResult.rows.reduce(
      (sum, item) => sum + (item.product_price * item.quantity),
      0
    );

    // Get cart sum from database
    const cart = await pool.query(
      'SELECT cart_sum FROM cart WHERE id = $1',
      [cartId]
    );

    if (!cart.rows.length) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Verify cart sum matches calculated sum
    if (Math.abs(cart.rows[0].cart_sum - cartSum) > 0.01) { // Using 0.01 to handle floating point precision
      return res.status(400).json({ 
        error: "Cart sum mismatch. Prices may have changed.",
        storedSum: cart.rows[0].cart_sum,
        calculatedSum: cartSum
      });
    }

    // Attach validated cart data to request for use in controller
    req.validatedCart = {
      items: cartResult.rows,
      totalSum: cartSum
    };

    next();
  } catch (error) {
    console.error('Error in validateCartProducts middleware:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 