import { dbReqisterAcc, dbCheckEmail } from "../models/account.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const createAccount = async (req,res) =>{
    const {
            profile_picture,
            firstname,
            surname,
            phone_number,
            address,
            post_number,
            city,
            email,
            password
        } = req.body;
        
    try {
        // Check if email already exists
        const existingUser = await pool.query(
            'SELECT id FROM account WHERE email = $1',
            [email.toLowerCase()]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const account = await dbReqisterAcc(
            profile_picture,
            firstname,
            surname,
            phone_number,
            address,
            post_number,
            city,
            email.toLowerCase(),
            hashedPassword
        );
        res.status(201).json({
            message: "Account created",
            firstname: account.firstname,
            surname: account.surname,
            account_id: account.account_id
        });

    } catch (err) {
        console.error("Error during account registration:", err);
        res.status(500).json({ error: 'Database error' });
    }
}

export const loginAccount = async (req,res) =>{
    const { email, password } = req.body;

    try {
        const result = await pool.query(
            `SELECT id, email, password_hash, account_id, role, firstname, surname 
             FROM account 
             WHERE email = $1`,
            [email.toLowerCase()]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({error: "Account not found."});
        }

        const account = result.rows[0];
        const validPassword = await bcrypt.compare(password, account.password_hash);

        if (!validPassword) {
            return res.status(401).json({error: "Wrong e-mail or password. Please try again."});
        }

        const token = jwt.sign(
            { 
                id: account.id,
                account_id: account.account_id, 
                email: account.email,
                role: account.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                firstname: account.firstname,
                surname: account.surname,
                role: account.role
            }
        });
    } catch(err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Login failed' });
    }
}

export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await pool.query(
            `SELECT id, profile_picture, firstname, surname, phone_number, 
                    address, post_number, city, email, account_id, role
             FROM account 
             WHERE id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Profile not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Error fetching profile' });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const updates = req.body;
        
        // Build dynamic update query
        const validFields = ['profile_picture', 'firstname', 'surname', 
                           'phone_number', 'address', 'post_number', 'city'];
        const updateFields = [];
        const values = [userId];
        let paramCount = 1;

        for (const [key, value] of Object.entries(updates)) {
            if (validFields.includes(key) && value !== undefined) {
                updateFields.push(`${key} = $${++paramCount}`);
                values.push(value);
            }
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ error: "No valid fields to update" });
        }

        const query = `
            UPDATE account 
            SET ${updateFields.join(', ')}
            WHERE id = $1
            RETURNING id, profile_picture, firstname, surname, 
                      phone_number, address, post_number, city, 
                      email, account_id, role`;

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Profile not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Error updating profile' });
    }
};

export const updatePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        // Get current password hash
        const result = await pool.query(
            'SELECT password_hash FROM account WHERE id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Account not found" });
        }

        // Verify current password
        const validPassword = await bcrypt.compare(
            currentPassword, 
            result.rows[0].password_hash
        );

        if (!validPassword) {
            return res.status(401).json({ error: "Current password is incorrect" });
        }

        // Hash and update new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query(
            'UPDATE account SET password_hash = $1 WHERE id = $2',
            [hashedPassword, userId]
        );

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ error: 'Error updating password' });
    }
};

export const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        
        // Generate reset token
        const resetToken = jwt.sign(
            { email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Store reset token in database
        await pool.query(
            `UPDATE account 
             SET reset_token = $1, reset_token_expires = NOW() + INTERVAL '1 hour'
             WHERE email = $2`,
            [resetToken, email.toLowerCase()]
        );

        // In a real application, send email with reset token
        // For testing purposes, we'll return it in the response
        res.status(200).json({ 
            message: "Password reset requested. Check your email for instructions.",
            resetToken // Remove this in production
        });
    } catch (error) {
        console.error('Error requesting password reset:', error);
        res.status(500).json({ error: 'Error requesting password reset' });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, resetToken, newPassword } = req.body;

        // Verify token and check expiration
        const result = await pool.query(
            `SELECT id FROM account 
             WHERE email = $1 
             AND reset_token = $2 
             AND reset_token_expires > NOW()`,
            [email.toLowerCase(), resetToken]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ error: "Invalid or expired reset token" });
        }

        // Hash and update password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query(
            `UPDATE account 
             SET password_hash = $1, 
                 reset_token = NULL, 
                 reset_token_expires = NULL
             WHERE id = $2`,
            [hashedPassword, result.rows[0].id]
        );

        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ error: 'Error resetting password' });
    }
};
