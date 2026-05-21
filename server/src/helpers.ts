import { createHash } from 'crypto';
import { ModelInfo } from "@lmstudio/sdk";

export function clampNumber(value: number, min: number, max: number): number {
  if (typeof value !== 'number' || typeof min !== 'number' || typeof max !== 'number') 
    throw new Error('All arguments must be valid numbers.');
  
  const lower = Math.min(min, max);
  const upper = Math.max(min, max);
  return Math.min(Math.max(value, lower), upper);
}

export function LimitString(str: string, n: number): string {
  if (typeof str !== "string" || typeof n !== "number" || n < 0) {
    return "";
  }
  return str.slice(0, n);
}

export function generateUserFolderId(email: string, userId: number): string {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !Number.isInteger(userId) || userId <= 0) {
    throw new Error('Invalid email or userId');
  }

  const input = `${normalizedEmail}:${userId}`;

  return createHash('sha256').update(input).digest('hex').slice(0, 25);
}

export function get_model(path: string, models: ModelInfo[]): ModelInfo | null {
  const out = models.find(m => m.path.toLowerCase() === path.toLowerCase());
  if (out === undefined) {
    console.log("Model path not found in list: " + path);
  }
  return out !== undefined ? out : null;
}

export function is_model_available(list: ModelInfo[], name: string): boolean {
  for (let it of list) {
    if (it.displayName === name) {
      return true;
    }
  }
  return false;
}
