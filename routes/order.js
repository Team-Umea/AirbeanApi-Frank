import express from "express";
const router = express.Router();

router.get("/:id", (req, res) => {
  res
    .status(200)
    .send("hämta din order på ditt orderId som du fick när du beställde");
});

router.post("/", (req, res) => {});

export default router;

//make an order
