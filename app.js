import express from "express";
import attachPool from "./middleware/attachPool.js";
import accountRoute from "./routes/account.js"
const app = express();
app.use(express.json());
app.use(attachPool);
app.get("/", (req, res) => {
  res.status(200).send("Hej världern");
});
app.use("/account", accountRoute);
export default app;