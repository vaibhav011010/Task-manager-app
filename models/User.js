import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, sparse: true }, // Only for Google users
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Now optional for Google users
  avatar: { type: String }, // Store Google profile picture if available
});

// Hash password before saving user (Only for traditional signups)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default mongoose.model("User", userSchema);
