import express from "express";
import attachPool from "./middleware/attachPool.js";
import orderPage from "./routes/order.js";
import cartPage from "./routes/cart.js";
import productPage from "./routes/product.js";
import accountRoute from "./routes/account.js"
const app = express();
app.use(express.json());
app.use(attachPool);
app.get("/", (req, res) => {
  res.status(200).send("Hej världern");
});
app.use("/account", accountRoute)
app.use("/product", productPage);
app.use("/order", orderPage);
app.use("/cart", cartPage);
export default app;
