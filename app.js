import express from "express";
import attachPool from "./middleware/attachPool.js";
import orderPage from "./routes/order.js";
import cartPage from "./routes/cart.js";
import accountRoutes from "./routes/account.js";
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

app.use(attachPool);

app.get("/", (req, res) => {
  res.status(200).send("Hej världen!");
});
app.use("/account", accountRoutes);
app.use("/order", orderPage);
app.use("/cart", cartPage);
export default app;
