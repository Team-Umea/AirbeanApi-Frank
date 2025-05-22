import pool from "../config/db.js";

// ✅ Internal helper (no Express)
export const advanceOrderStatus = async (orderId) => {
  const orderResult = await pool.query(`SELECT * FROM "order" WHERE id = $1`, [orderId]);
  const order = orderResult.rows[0];

  if (!order) return { status: 404, message: "Order not found" };

  if (order.status === "pending") {
    await pool.query(`UPDATE "order" SET status = 'delivering' WHERE id = $1`, [orderId]);
    return { status: 200, message: "Order is now delivering" };

  } else if (order.status === "delivering") {
    await pool.query(`UPDATE "order" SET status = 'delivered', delivered_at = NOW() WHERE id = $1`, [orderId]);
    return { status: 200, message: "Order is now delivered" };

  } else {
    return { status: 200, message: `Order is already ${order.status}` };
  }
};