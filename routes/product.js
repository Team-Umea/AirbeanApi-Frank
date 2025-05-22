import express from "express";
const router = express.Router();
import {
  getItems,
  addItem,
  deletedItem,
  updatedItem,
} from "../controllers/product.controller.js";

//Get all products
//public för alla användare som loggar in på sidan
router.get("/items", getItems);

//Add new products
//bara admins får lägga in ny produkt
router.post("/additem", addItem);

//delete producs
//bara admins får lägga in ny produkt
router.delete("/delete/:itemID", deletedItem);

//update products
//bara admins får lägga in ny produkt
router.patch("/update/:itemID", updatedItem);

export default router;
