import express from "express";
const router = express.Router();

//skapa en order hämtar dina items från cart och lägger in det i order
router.post("/");

//make an order
//min profil ska visa orderhistorik som visar tot summa och orderid samt datum
router.get("/history/:userId");

//visar din order status med förväntad leveranstid
router.get("/status/:orderId");

export default router;
