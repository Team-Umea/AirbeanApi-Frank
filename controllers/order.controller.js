import {
  dbCreateOrder,
  dbGetOrder,
  dbOrderHistory,
} from "../models/order.model.js";
import { dbGetCart } from "../models/cart.model.js";
//logik för routes

export const createOrder = async (req, res) => {
  const { cartId } = req.body;

  try {
    const cart = await dbGetCart(cartId);
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "no items in your cart" });
    }
    const order = await dbCreateOrder(cart);
    res.status(200).json({ cart });
  } catch (error) {}
};

export const orderHistory = async (req, res) => {};

export const getOrder = async (req, res) => {};
