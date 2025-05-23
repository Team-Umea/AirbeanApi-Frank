import { dbReqisterAcc, dbCheckEmail } from "../models/account.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const createAccount = async (req, res) => {
  const {
    profile_picture,
    firstname,
    surname,
    phone_number,
    address,
    post_number,
    city,
    email,
    password,
    role,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    const account = await dbReqisterAcc(
      profile_picture,
      firstname,
      surname,
      phone_number,
      address,
      post_number,
      city,
      email.toLowerCase(),
      hashedPassword,
      role || "user"
    );
    res.status(201).json("account created", account.firstname, account.surname);
  } catch (err) {
    console.error("Error during account registration:", err);
    res.status(500).json({ error: "Database error" });
  }
};
export const loginAccount = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await dbCheckEmail(email.toLowerCase());

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Account not found." });
    }
    const account = result.rows[0];
    const validPassword = await bcrypt.compare(password, account.password_hash);

    if (!validPassword) {
      return res
        .status(401)
        .json({ error: "Wrong e-mail or password. Please try again." });
    }

    const token = jwt.sign(
      {
        account_id: account.account_id,
        email: account.email,
        role: account.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login succesful", token });
  } catch (err) {
    console.error("Fel vid inloggning:", err);
    res.status(500).json({ error: "Inloggning misslyckades" });
  }
};
