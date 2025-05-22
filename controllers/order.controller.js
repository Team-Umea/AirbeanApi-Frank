import {
  dbCreateOrder,
  dbGetOrder,
  dbOrderHistory,
} from "../models/order.model.js";
import { dbGetCart, dbEmptyCart } from "../models/cart.model.js";
//logik för routes

export const createOrder = async (req, res) => {
  const { cartId } = req.body;

  try {
    const cart = await dbGetCart(cartId);
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "no items in your cart" });
    }
    const order = await dbCreateOrder(cart);
    dbEmptyCart(cartId);
    res.status(200).json({ order });
  } catch (error) {
    res.status(500).send("Error creating order");
  }
};

export const orderHistory = async (req, res) => {};

export const confirmOrder = async (req, res) => {
  const { orderId } = req.body;

  try {
    const result = await advanceOrderStatus(orderId);
    res.status(result.status).json({ message: result.message });
  } catch (error) {
    console.error("Error in confirmOrder:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const simulateOrderLifecycle = async (orderId) => {
  // Step 1: Go from pending → delivering after 5 seconds
  setTimeout(async () => {
    const result = await advanceOrderStatus(orderId);
    console.log(`[Simulate] ${result.message}`);
  }, 5000);

  // Step 2: Go from delivering → delivered after 10–25 minutes
  const randomMinutes = 10 + Math.floor(Math.random() * 16);
  setTimeout(async () => {
    const result = await advanceOrderStatus(orderId);
    console.log(`[Simulate] ${result.message}`);
  }, randomMinutes * 60000);
};

export const getOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const orderResult = await pool.query(`
       SELECT * FROM "order"
       WHERE id = $1 
       AND status NOT IN ('delivered')`, 
       [orderId]);

    if (orderResult.rows.length === 0 ){
      return res.status(404).json({ error: "Order not found or already delivered"});
    }

    res.status(200).json(orderResult.rows[0]);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Internal server error" });
  }

};
