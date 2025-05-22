import {
  dbCreateOrder,
  dbGetOrderStatus,
  dbOrderHistory,
} from "../models/order.model.js";

import { dbGetCart, dbClearCart } from "../models/cart.model.js";
import pool from "../config/db.js";

// Create an order from a cart
export const createOrder = async (req, res) => {
  const { cartId } = req.body;

  try {
    const cart = await dbGetCart(cartId);
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Your cart is empty" });
    }

    const customerResult = await pool.query(
      `SELECT account_id FROM cart WHERE id = $1`,
      [cartId]
    );
    const accountId = customerResult.rows[0]?.account_id;

    if (!accountId) {
      return res.status(400).json({ error: "Cart is not linked to a user" });
    }

    const order = await dbCreateOrder({ ...cart, account_id: accountId });
    await dbClearCart(cartId);

    res.status(201).json({ message: "Order created", order });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).send("Server error while creating order");
  }
};

// Return order status + remaining time
export const getOrderStatus = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await dbGetOrderStatus(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({
      order_id: order.order_id,
      status: order.status,
      estimated_delivery: order.delivery_time,
      time_remaining: order.time_remaining,
    });
  } catch (error) {
    console.error("Error fetching order status:", error);
    res.status(500).send("Server error while fetching order status");
  }
};

// Return user's full order history
export const getOrderHistory = async (req, res) => {
  const { userId } = req.params;

  try {
    const history = await dbOrderHistory(userId);
    res.status(200).json({ orders: history });
  } catch (error) {
    console.error("Error fetching order history:", error);
    res.status(500).send("Server error while fetching order history");
  }
};
