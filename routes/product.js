import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import checkRole from "../middleware/authorizeRole.js";
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
router.post("/additem", verifyJWT, checkRole("admin"), addItem);

//delete producs
//bara admins får lägga in ny produkt
router.delete("/delete/:itemID", verifyJWT, checkRole("admin"), deletedItem);

//update products
//bara admins får lägga in ny produkt
router.patch("/update/:itemID", verifyJWT, checkRole("admin"), updatedItem);

export default router;
