import pool from "../config/db.js";
//these should be used when adding to cart for example
const validateProductExists = async (req, res, next) => {
    const { product_id } = req.body; // uses product_id from request body to find info needed
    try {
        const product = await pool.query('SELECT * FROM product WHERE id = $1', [product_id]);
        if (product.rows.length === 0) {
            return res.status(404).json({ error: 'product not found' });
        }
        req.product = product.rows[0]; // passes down data to req
        next();
    } catch (err) {
        res.status(500).json({ error: 'database error' });
    }
};

const validateProductPrice = (req, res, next) => {
    const { price } = req.body; // uses price from request body
    if (req.product.price !== price) {
        return res.status(400).json({ error: 'price does not match the product price' });
    }
    next();
};

export default {validateProductExists, validateProductPrice}