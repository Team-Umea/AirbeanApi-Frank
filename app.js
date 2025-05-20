import express from "express";
import orderPage from "./routes/Order.js";
import attachPool from "./middleware/attachPool.js";

const app = express();
app.use(express.json());
app.use(attachPool);
app.get("/", (req, res) => {
  res.status(200).send("Hej världern");
});
app.use("/orders", orderPage);
export default app;
