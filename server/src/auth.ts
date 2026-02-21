import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthUser {
  id: string;
  username: string;
}

const jwtSecret = process.env.JWT_SECRET || "dev_secret_change_me";

export const signToken = (user: AuthUser) =>
  jwt.sign(user, jwtSecret, { expiresIn: "7d" });

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.session;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, jwtSecret) as AuthUser;
    (req as Request & { user: AuthUser }).user = decoded;
    return next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
