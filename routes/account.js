import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validateInputs from "../middleware/validateInputs.js";
import pool from "../config/db.js";
import {createAccount, loginAccount} from "../controllers/account.controller.js"
const router = express.Router();

router.post("/register",validateInputs.validateAccountInput,validateInputs.accountValidation, createAccount)

//login account
router.post("/login", loginAccount)
export default router;