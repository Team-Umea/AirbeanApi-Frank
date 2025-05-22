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
    const orderResult = await pool.query(`SELECT * FROM "order" WHERE id = $1`, [orderId]);
    const order = orderResult.rows[0];

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

   if (order.status === 'pending') {
      await pool.query(`UPDATE "order" SET status = 'delivering' WHERE id = $1`, [orderId]);

      const randomMinutes = 10 + Math.floor(Math.random() * 16);

      // Schedule delivery
      setTimeout(async () => {
        await pool.query(`UPDATE "order" SET status = 'delivered' WHERE id = $1`, [orderId]);
        console.log(`Order ${orderId} has been delivered!`);
      }, randomMinutes * 60000); // ⏱️ Convert to milliseconds

      return res.status(200).json({ message: `Order ${orderId} is now delivering` });

    } else if (order.status === 'delivering') {
      return res.status(200).json({ message: `Order ${orderId} is already delivering` });

    } else if (order.status === 'delivered') {
      return res.status(200).json({ message: `Order ${orderId} has already been delivered` });
    }

    return res.status(400).json({ message: `Order ${orderId} is in unknown status` });

  } catch (error) {
    console.error("Error in confirmOrder:", error);
    res.status(500).json({ error: "Internal server error" });
  }
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
