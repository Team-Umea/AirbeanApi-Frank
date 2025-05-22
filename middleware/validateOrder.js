import { body, param, validationResult } from "express-validator";
import pool from "../config/db.js";

export const validateCreateOrder = [
  body("cartId")
    .notEmpty()
    .withMessage("cartId is required")
    .isInt()
    .withMessage("cartId must be a number"),
];

export const validateOrderId = [
  param("orderId")
    .notEmpty()
    .withMessage("orderId is required")
    .isInt()
    .withMessage("orderId must be a number"),
];

export const validateUserId = [
  param("userId")
    .notEmpty()
    .withMessage("userId is required")
    .isInt()
    .withMessage("userId must be a number"),
];

export const validateOrderStatus = [
  body("status")
    .notEmpty()
    .withMessage("status is required")
    .isIn(['pending', 'preparing', 'delivering', 'delivered'])
    .withMessage("Invalid status value"),
];

export const validateOrderInput = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Middleware to check if user is admin
export const isAdmin = async (req, res, next) => {
  try {
    const user = req.user; // Set by authJWT middleware
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  } catch (error) {
    console.error('Error in isAdmin middleware:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Middleware to verify order ownership
export const verifyOrderOwnership = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const userId = req.user.id; // Set by authJWT middleware

    const order = await pool.query(
      'SELECT account_id FROM "order" WHERE id = $1',
      [orderId]
    );

    if (!order.rows.length) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.rows[0].account_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to access this order' });
    }

    next();
  } catch (error) {
    console.error('Error in verifyOrderOwnership middleware:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 