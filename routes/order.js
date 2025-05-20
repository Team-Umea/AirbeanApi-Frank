import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("hejsan order");
});

export default router;

//make an order
