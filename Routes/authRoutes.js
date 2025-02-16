import express from "express";
import { check, validationResult } from "express-validator";
import {
  registerUser,
  loginUser,
  googleAuth,
} from "../controllers/authController.js";

const router = express.Router();

// Validation middleware
const validateRegister = [
  check("name", "Name is required").not().isEmpty(),
  check("email", "Please enter a valid email").isEmail(),
  check("password", "Password must be at least 6 characters").isLength({
    min: 6,
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateLogin = [
  check("email", "Please enter a valid email").isEmail(),
  check("password", "Password is required").not().isEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Traditional email/password authentication with validation
router.post("/register", validateRegister, registerUser);
router.post("/login", validateLogin, loginUser);

// Google OAuth authentication (No validation needed as it comes from Google)
router.post("/google-login", googleAuth);

export default router;
