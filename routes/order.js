import express from "express";
import {
  createOrder,
  getOrder,
  orderHistory,
  updateOrderStatus
} from "../controllers/order.controller.js";
import authJWT from "../middleware/authJWT.js";
import {
  validateCreateOrder,
  validateOrderId,
  validateUserId,
  validateOrderStatus,
  validateOrderInput,
  isAdmin,
  verifyOrderOwnership
} from "../middleware/validateOrder.js";
import { validateCartProducts } from "../middleware/validateCart.js";

const router = express.Router();

// Create a new order from cart items
router.post("/", [
  authJWT,
  validateCreateOrder,
  validateOrderInput,
  validateCartProducts
], createOrder);

// Get order history for a specific user
router.get("/history/:userId", [
  authJWT,
  validateUserId,
  validateOrderInput,
  async (req, res, next) => {
    // Check if user is requesting their own history or is admin
    if (req.user.id === parseInt(req.params.userId) || req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ error: 'Not authorized to view this order history' });
    }
  }
], orderHistory);

// Get specific order status and details
router.get("/status/:orderId", [
  authJWT,
  validateOrderId,
  validateOrderInput,
  verifyOrderOwnership
], getOrder);

// Update order status (admin only)
router.patch("/status/:orderId", [
  authJWT,
  isAdmin,
  validateOrderId,
  validateOrderStatus,
  validateOrderInput
], updateOrderStatus);

export default router;
