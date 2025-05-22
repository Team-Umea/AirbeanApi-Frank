import express from "express";
const router = express.Router();
import { getItems, addItem } from "../controllers/product.controller.js";

//Get all products
//public för alla användare som loggar in på sidan
router.get("/items", getItems);

//Add new products
//bara admins får lägga in ny produkt
router.post("/additem", addItem);

//delete producs
//bara admins får lägga in ny produkt
// router.delete("/remove/:itemID");

//update products
//bara admins får lägga in ny produkt
// router.patch("/update/:itemID");

export default router;
