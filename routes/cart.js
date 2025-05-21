import express from "express";
import {
  createCart,
  addItemToCart,
  getCart,
  removeItemFromCart,
  shareCart,
} from "../controllers/cart.controller.js";
const router = express.Router();

router.post("/", createCart);
//skapa ny cart i db => skicka ett cartID som jag sedan använder för att posta mina items till [Cart]

router.post("/:cartId/items", addItemToCart);
//för att lägga till items i cart

router.get("/:cartId", getCart);
// För att visa min cart och se vilka kaffesorter jag vill köpa

//remove item from cart
router.delete("/:cartId/items/:itemId", removeItemFromCart);
//För att ta bort ett specefikt item i min varukorg

//Ifall vi vill dela våran cart med våra vänner men tänker att det är onödigt kanske med detta projektet?
router.get("/:cartId/share", shareCart);
export default router;
