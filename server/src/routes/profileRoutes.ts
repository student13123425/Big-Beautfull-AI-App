import { Request, Response } from 'express';

export function getBirthday(_req: Request, res: Response) {
  const birthday = process.env.AUTHOR_BIRTHDAY || '';
  if (!birthday) {
    return res.status(500).json({ error: 'AUTHOR_BIRTHDAY not configured on server' });
  }
  return res.json({ birthday });
}