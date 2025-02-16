import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
console.log("JWT_SECRET:", process.env.JWT_SECRET);

// 🔹 Register User (Email/Password)
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "User already exists" });

    user = new User({ name, email, password });
    await user.save();

    res.json({ token: generateToken(user), user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Login User (Email/Password)
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.password)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    res.json({ token: generateToken(user), user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Google OAuth Login
export const googleAuth = async (req, res) => {
  try {
    const { googleId, email, name, avatar } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ googleId, name, email, avatar });
      await user.save();
    }

    res.json({ token: generateToken(user), user });
  } catch (error) {
    res.status(500).json({ message: "Google authentication failed" });
  }
};
