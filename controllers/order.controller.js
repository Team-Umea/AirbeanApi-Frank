import {
  dbCreateOrder,
  dbGetOrder,
  dbOrderHistory,
} from "../models/order.model.js";
import { dbGetCart, dbEmptyCart } from "../models/cart.model.js";
import pool from "../config/db.js";

const ORDER_STATUSES = {
  PENDING: 'pending',
  PREPARING: 'preparing',
  DELIVERING: 'delivering',
  DELIVERED: 'delivered'
};

export const createOrder = async (req, res) => {
  const { cartId } = req.body;

  if (!cartId) {
    return res.status(400).json({ error: "cartId is required" });
  }

  try {
    const cart = await dbGetCart(cartId);
    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ error: "No items in your cart" });
    }

    if (!cart.account_id) {
      return res.status(400).json({ error: "User must be logged in to create an order" });
    }

    const order = await dbCreateOrder(cart);
    await dbEmptyCart(cartId);

    // Calculate estimated delivery time (10-25 minutes)
    const estimatedDeliveryMinutes = 10 + Math.floor(Math.random() * 16);
    const estimatedDeliveryTime = new Date(Date.now() + estimatedDeliveryMinutes * 60000);

    // Automatically transition to preparing after creation
    await pool.query(
      `UPDATE "order" SET status = $1 WHERE id = $2`,
      [ORDER_STATUSES.PREPARING, order.id]
    );

    res.status(201).json({
      order: {
        ...order,
        status: ORDER_STATUSES.PREPARING
      },
      estimatedDeliveryTime,
      message: `Your order will be delivered in approximately ${estimatedDeliveryMinutes} minutes`
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Error creating order" });
  }
};

export const orderHistory = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    const orders = await dbOrderHistory(userId);
    
    if (!orders || orders.length === 0) {
      return res.status(200).json({ 
        message: "No orders found",
        orders: []
      });
    }

    // Transform the response to include formatted dates and total items
    const formattedOrders = orders.map(order => ({
      ...order,
      created_at: new Date(order.created_at).toLocaleString(),
      total_items: order.items.reduce((sum, item) => sum + item.quantity, 0),
      total_amount: order.order_sum,
      items: order.items.filter(item => item.product_id !== null), // Remove null entries if any
      estimated_delivery: order.status !== ORDER_STATUSES.DELIVERED ? 
        new Date(new Date(order.created_at).getTime() + 25 * 60000).toLocaleString() : 
        null
    }));

    res.status(200).json({
      total_orders: formattedOrders.length,
      total_spent: formattedOrders.reduce((sum, order) => sum + order.order_sum, 0),
      orders: formattedOrders
    });
  } catch (error) {
    console.error("Error fetching order history:", error);
    res.status(500).json({ error: "Error fetching order history" });
  }
};

export const getOrder = async (req, res) => {
  const { orderId } = req.params;

  if (!orderId) {
    return res.status(400).json({ error: "orderId is required" });
  }

  try {
    const order = await dbGetOrder(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Format the response
    const formattedOrder = {
      ...order,
      created_at: new Date(order.created_at).toLocaleString(),
      total_items: order.items.reduce((sum, item) => sum + item.quantity, 0),
      total_amount: order.order_sum,
      items: order.items.filter(item => item.product_id !== null),
      estimated_delivery: order.status !== ORDER_STATUSES.DELIVERED ? 
        new Date(new Date(order.created_at).getTime() + 25 * 60000).toLocaleString() : 
        null
    };

    res.status(200).json(formattedOrder);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Error fetching order" });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  if (!orderId || !status) {
    return res.status(400).json({ error: "orderId and status are required" });
  }

  const validStatuses = Object.values(ORDER_STATUSES);
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ 
      error: "Invalid status",
      validStatuses
    });
  }

  try {
    // Get current order status
    const currentOrder = await pool.query(
      `SELECT status FROM "order" WHERE id = $1`,
      [orderId]
    );

    if (currentOrder.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const currentStatus = currentOrder.rows[0].status;

    // Validate status transition
    const validTransitions = {
      [ORDER_STATUSES.PENDING]: [ORDER_STATUSES.PREPARING],
      [ORDER_STATUSES.PREPARING]: [ORDER_STATUSES.DELIVERING],
      [ORDER_STATUSES.DELIVERING]: [ORDER_STATUSES.DELIVERED],
      [ORDER_STATUSES.DELIVERED]: [] // Cannot transition from delivered
    };

    if (!validTransitions[currentStatus].includes(status)) {
      return res.status(400).json({ 
        error: `Invalid status transition from ${currentStatus} to ${status}`,
        validTransitions: validTransitions[currentStatus]
      });
    }

    const result = await pool.query(
      `UPDATE "order" 
       SET status = $1
       WHERE id = $2 
       RETURNING *`,
      [status, orderId]
    );

    // If transitioning to delivered, calculate actual delivery time
    if (status === ORDER_STATUSES.DELIVERED) {
      const deliveryTime = Math.round((Date.now() - new Date(result.rows[0].created_at).getTime()) / 60000);
      return res.status(200).json({
        ...result.rows[0],
        delivery_time: `${deliveryTime} minutes`,
        message: `Order ${orderId} has been delivered in ${deliveryTime} minutes`
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Error updating order status" });
  }
};
