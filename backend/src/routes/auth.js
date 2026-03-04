import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";
import { loginSchema, registerSchema } from "../utils/validators.js";
import { User } from "../models/User.js";

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true
});

router.post("/register", authLimiter, async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: parsed.error.message });

  const { name, email, password } = parsed.data;
  const exists = await User.findOne({ email }).select("_id");
  if (exists) return res.status(409).json({ message: "Email already registered" });

  const hash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password_hash: hash, role: "user" });
  return res.status(201).json({ id: String(user._id), name: user.name, email: user.email, role: user.role });
});

router.post("/login", authLimiter, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: parsed.error.message });

  const { email, password } = parsed.data;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: String(user._id), email: user.email, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });
  return res.json({ token, user: { id: String(user._id), name: user.name, email: user.email, role: user.role } });
});

export default router;
