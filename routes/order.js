import express from "express";
import {
  createOrder,
  getOrder,
  orderHistory,
} from "../controllers/order.controller.js";
const router = express.Router();

//skapa en order hämtar dina items från cart och lägger in det i order
router.post("/", createOrder);

//make an order
//min profil ska visa orderhistorik som visar tot summa och orderid samt datum
router.get("/history/:userId", orderHistory);

//visar din order status med förväntad leveranstid
router.get("/status/:orderId", getOrder);

export default router;
