import express from 'express';
import jwt from 'jsonwebtoken';
import pool from "../config/db.js";
import Account from '../models/Account.js';
const router = express.Router();

// 📌 Registrera konto
router.post('/register', async (req, res) => {
  try {
    // Skapar ett konto-objekt från request-body
    const account = await Account.fromRequest(req.body);

    const result = await pool.query(`
      INSERT INTO account (
        id, profile_picture, firstname, surname, phone_number,
        adress, post_number, city, email, password_hash, user_id
      ) VALUES (
        DEFAULT, $1, $2, $3, $4,
        $5, $6, $7, $8, $9, $10
      ) RETURNING *
    `, [
      account.profile_picture,
      account.firstname,
      account.surname,
      account.phone_number,
      account.adress,
      account.post_number,
      account.city,
      account.email,
      account.password_hash,
      account.user_id
    ]);

    res.status(201).json({ message: 'Konto registrerat', account: account.toPublic() });
  } catch (err) {
    console.error('Fel vid registrering:', err);
    res.status(500).json({ error: 'Misslyckades med att registrera konto' });
  }
});

// 🔐 Logga in
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM account WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Kontot hittades inte.' });
    }

    // Skapar ett konto-objekt från databasen
    const accountData = result.rows[0];
    const account = new Account(
      accountData.id,
      accountData.profile_picture,
      accountData.firstname,
      accountData.surname,
      accountData.phone_number,
      accountData.adress,
      accountData.post_number,
      accountData.city,
      accountData.email,
      accountData.password_hash,
      accountData.user_id
    );

    const validPassword = await account.verifyPassword(password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Fel e-postadress eller lösenord. Försök igen.' });
    }

    const token = jwt.sign(
      { user_id: account.user_id, email: account.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    delete account.password_hash;

    res.status(200).json({ message: 'Inloggning lyckades', token, account: account.toPublic() });
  } catch (err) {
    console.error('Fel vid inloggning:', err);
    res.status(500).json({ error: 'Inloggning misslyckades' });
  }
});

export default router;
