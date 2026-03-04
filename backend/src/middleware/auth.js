import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";

export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.id).select("_id email role");
    if (!user) {
      return res.status(401).json({ message: "Session invalid. Please login again." });
    }
    req.user = {
      id: String(user._id),
      email: user.email,
      role: user.role
    };
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}
