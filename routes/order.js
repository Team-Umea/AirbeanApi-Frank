import express from "express";
import {
  createOrder,
  getOrderStatus,
  getOrderHistory,
  updateOrderStatus,
} from "../controllers/order.controller.js";
const router = express.Router();

//skapa en order hämtar dina items från cart och lägger in det i order
router.post("/", createOrder);

//make an order
//min profil ska visa orderhistorik som visar tot summa och orderid för varje order samt datum när du beställde
router.get("/history/:userId", getOrderHistory);

//visar din order status med förväntad leveranstid
router.get("/status/:orderId", getOrderStatus);

//ändra pending
router.put("/status/:orderId/update", updateOrderStatus);
export default router;
