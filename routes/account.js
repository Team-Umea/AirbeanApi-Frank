import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validateInputs from "../middleware/validateInputs.js";
import authJWT from "../middleware/authJWT.js";
import { 
  createAccount, 
  loginAccount, 
  updateProfile,
  updatePassword,
  requestPasswordReset,
  resetPassword,
  getProfile
} from "../controllers/account.controller.js";

const router = express.Router();

// Account creation and authentication
router.post("/register", validateInputs.validateAccountInput, validateInputs.accountValidation, createAccount);
router.post("/login", loginAccount);

// Profile management (requires authentication)
router.get("/profile", authJWT, getProfile);
router.patch("/profile", [
  authJWT,
  validateInputs.validateProfileUpdate,
  validateInputs.accountValidation
], updateProfile);

// Password management
router.post("/password/request-reset", requestPasswordReset);
router.post("/password/reset", resetPassword);
router.patch("/password/update", [
  authJWT,
  validateInputs.validatePasswordUpdate,
  validateInputs.accountValidation
], updatePassword);

export default router;