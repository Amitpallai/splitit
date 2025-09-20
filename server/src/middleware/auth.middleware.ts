import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
}

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export default function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "") || req.cookies?.token;
    if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });

    const decoded: any = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId; // match your JWT payload key
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}
