import {
  dbCreateCart,
  dbAddItemToCart,
  dbGetCart,
  dbRemoveItemFromCart,
  dbEmptyCart
} from "../models/cart.model.js";
//logik för routes
export const createCart = async (req, res) => {
  const { account_id } = req.body;
  try {
    const cartId = await dbCreateCart(account_id);
    res.status(201).json({ cartId });
  } catch (error) {
    console.error("Error in createCart:", error);
    res.status(500).send("Error creating cart");
  }
};

export const addItemToCart = async (req, res) => {
  const { cartId } = req.params;
  const { product_id, quantity } = req.body;
  try {
    await dbAddItemToCart(cartId, product_id, quantity);
    res.status(201).send("Item added");
  } catch (error) {
    res.status(500).send("Error adding item");
  }
};

export const getCart = async (req, res) => {
  const { cartId } = req.params;
  try {
    const cartData = await dbGetCart(cartId);
    res.status(200).json(cartData);
  } catch (error) {
    res.status(500).send("Error fetching cart");
  }
};

export const removeItemFromCart = async (req, res) => {
  const { cartId, itemId } = req.params;
  try {
    await dbRemoveItemFromCart(cartId, itemId);
    res.status(200).send("Item removed");
  } catch (error) {
    res.status(500).send("Error removing item");
  }
};


export const emptyCart = async (req, res) => {
  const { cartId } = req.params;
  try {
    await dbEmptyCart(cartId);
    res.status(200).send("Cart emptied");
  } catch (error) {
    res.status(500).send("Error emptying cart");
  }
};

export const shareCart = async (req, res) => {
  const { cartId } = req.params;
  // Ev. logik för att skapa delningslänk
  res.send({ shareUrl: `https://yourapp.com/cart/${cartId}` });
};
