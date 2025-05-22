import {
  dbGetItems,
  dbAddItem,
  dbDeletedItem,
  dbUpdatedItem,
} from "../models/product.model.js";

export const getItems = async (req, res) => {
  try {
    const menu = await dbGetItems();
    res.status(200).json({ menu });
  } catch (error) {
    res.status(500).send("error fetching the menu");
  }
};

export const addItem = async (req, res) => {
  const { product_name, product_price, product_info, product_stock } = req.body;
  try {
    const newProduct = await dbAddItem(
      product_name,
      product_price,
      product_info,
      product_stock
    );
    res.status(201).json({ newProduct });
  } catch (error) {
    res.status(500).send("error adding product");
  }
};
export const deletedItem = async (req, res) => {
  const productId = req.params.itemID;
  try {
    const deletedProduct = await dbDeletedItem(productId);
    res.status(200).json({ message: "product deleted", deletedProduct });
  } catch (error) {
    res.status(500).send("error deleting the product");
    console.log("Deleted product response:", deletedProduct);
  }
};

export const updatedItem = async (req, res) => {
  const productId = req.params.itemID;
  const { product_name, product_price, product_info } = req.body;
  try {
    const updatedProduct = await dbUpdatedItem(
      productId,
      product_name,
      product_price,
      product_info
    );
    res.status(201).json({ message: "product updated", updatedProduct });
  } catch (error) {
    res.status(500).send("error dupdating the product");
  }
};
