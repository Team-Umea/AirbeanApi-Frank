import pool from "../config/db.js";
export const dbReqisterAcc = async (
            profile_picture,
            firstname,
            surname,
            phone_number,
            address,
            post_number,
            city,
            email,
            hashedPassword) =>{
                const result = await pool.query(
                'INSERT INTO account (profile_picture, firstname, surname, phone_number, address, post_number, city, email, password_hash) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
                [profile_picture, firstname, surname, phone_number, address, post_number, city, email, hashedPassword]
            );
            return result.rows[0];
            }