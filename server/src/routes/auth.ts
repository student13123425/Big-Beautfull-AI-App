import { Request, Response } from "express";
import { login, registerUser, verifyToken } from "../services/auth.js";
import { mkdir, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

export function createTokenFolder(token: string): void {
  const tokenDir = join(__dirname, '..', '..', 'data', 'Tokens', token);
  if (!existsSync(tokenDir)) {
    mkdir(tokenDir, { recursive: true }, () => {});
  }
}

export function initGuestFolder(): void {
  const guestUserId = process.env.GUEST_USER_ID;
  if (guestUserId) {
    createTokenFolder(guestUserId);
  }
}

export function getUserFolderPath(userId: string): string {
  const guestUserId = process.env.GUEST_USER_ID;
  const effectiveId = userId || guestUserId;
  if (!effectiveId) {
    throw new Error("No user ID provided and no GUEST_USER_ID configured");
  }
  return join("data", effectiveId);
}

export function getUserMetaDataSpot(userId: string): string {
  const guestUserId = process.env.GUEST_USER_ID;
  const effectiveId = userId || guestUserId;
  if (!effectiveId) {
    throw new Error("No user ID provided and no GUEST_USER_ID configured");
  }
  return join("data","UserMetadata", `${effectiveId}.json`);
}

export function getGuestToken(req: Request, res: Response): void {
  const guestUserId = process.env.GUEST_USER_ID;
  if (!guestUserId) {
    res.status(500).json({ error: "GUEST_USER_ID not configured" });
    return;
  }
  res.json({ userId: guestUserId });
}

