import { dbAddItem, dbGetItems } from "../models/product.model.js";

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
