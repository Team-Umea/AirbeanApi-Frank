//jwt auth
import jwt from "jsonwebtoken";
import pool from "../config/db.js";


const authJWT = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).send('Access denied.');

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const user = await pool.query('SELECT * FROM account WHERE id = $1', [verified.id]);
        if (!user.rows.length) return res.status(401).send('User not found.');

        req.user = user.rows[0];
        next();
    } catch (err) {
        res.status(400).send('Invalid token.');
    }
};
export default authJWT;