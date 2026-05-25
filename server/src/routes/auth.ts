import { Request, Response } from "express";
import { login, registerUser, verifyToken } from "../services/auth.js";

interface RegisterBody {
  username?: string;
  email?: string;
  password?: string;
}

interface LoginBody {
  identifier?: string;
  password?: string;
}

interface VerifyTokenBody {
  token?: string;
}

export async function loginEndpoint(req: Request<{}, {}, LoginBody>, res: Response): Promise<void> {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  try {
    const token = await login(identifier, password);
    res.json({ token });
  } catch (err: any) {
    res.status(401).json({ error: err.message || "Invalid credentials" });
  }
}

export async function verifyTokenEndpoint(req: Request<{}, {}, VerifyTokenBody>, res: Response): Promise<void> {
  const { token } = req.body;
  if (!token) {
    res.status(400).json({ error: "Missing token" });
    return;
  }
  try {
    const userId = await verifyToken(token);
    if (userId !== null) {
      res.json({ userId: String(userId) });
    } else {
      res.json({ userId: "null" });
    }
  } catch (err: any) {
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function registerEndpoint(req: Request<{}, {}, RegisterBody>, res: Response): Promise<void> {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  try {
    const token = await registerUser(username, email, password);
    res.json({ token });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Registration failed" });
  }
}