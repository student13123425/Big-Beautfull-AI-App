import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';
import { generateUserFolderId } from './aox'; 

const DIR = path.join(process.cwd(), 'users');
const DB_PATH = path.join(DIR, 'users.db');

export class Token {
  public value: string;
  public expirationDate: Date;
  public userId: number;

  constructor(userId: number, expiresInMinutes: number = 60) {
    this.userId = userId;
    this.value = createHash('sha256').update(Math.random().toString()).digest('hex');
    this.expirationDate = new Date(Date.now() + expiresInMinutes * 60000);
  }

  public isValid(): boolean {
    return new Date() < this.expirationDate;
  }

  public toObject() {
    return {
      value: this.value,
      expirationDate: this.expirationDate.toISOString(),
      userId: this.userId
    };
  }

  static fromObject(obj: any): Token {
    const token = new Token(obj.userId);
    token.value = obj.value;
    token.expirationDate = new Date(obj.expirationDate);
    return token;
  }
}

export function initializeUserDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(DIR)) {
      fs.mkdirSync(DIR, { recursive: true });
    }

    const db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) return reject(err);
    });

    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL UNIQUE,
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          FolderHash TEXT NOT NULL,
          tokens TEXT DEFAULT '[]'
        );
      `, (err) => {
        db.close();
        if (err) return reject(err);
        resolve();
      });
    });
  });
}

export function createUser(username: string, email: string, password: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) return reject(err);
    });

    const insertQuery = `INSERT INTO users (username, email, password, FolderHash, tokens) VALUES (?, ?, ?, ?, '[]')`;
    
    db.run(insertQuery, [username, email, password, 'TEMP_HASH'], function(err) {
      if (err) {
        db.close();
        return reject(err);
      }

      const userId = this.lastID as number;

      try {
        const folderHash = generateUserFolderId(email, userId);

        db.run(`UPDATE users SET FolderHash = ? WHERE id = ?`, [folderHash, userId], (updateErr) => {
          db.close();
          if (updateErr) return reject(updateErr);
          resolve();
        });
      } catch (hashErr: any) {
        db.close();
        reject(hashErr);
      }
    });
  });
}

export function updateUserPassword(id: number, newPassword: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) return reject(err);
    });

    db.run(`UPDATE users SET password = ? WHERE id = ?`, [newPassword, id], function(err) {
      db.close();
      if (err) return reject(err);
      if (this.changes === 0) return reject(new Error(`No user found with ID: ${id}`));
      resolve();
    });
  });
}

export function getUserById(id: number): Promise<any> {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) return reject(err);
    });

    db.get(`SELECT * FROM users WHERE id = ?`, [id], (err, row: any) => {
      db.close();
      if (err) return reject(err);
      if (!row) return resolve(null);

      try {
        const tokenArray = JSON.parse(row.tokens || '[]');
        row.tokens = tokenArray.map((t: any) => Token.fromObject(t));
        resolve(row);
      } catch (parseErr) {
        reject(new Error("Failed to parse user tokens"));
      }
    });
  });
}

export async function getUserFolderPath(userId: number): Promise<string> {
    const user = await getUserById(userId);
    if (!user) throw new Error("User not found");
    return path.join(process.cwd(), 'data', user.FolderHash, '/');
}

export async function userExists(identifier: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(DB_PATH, (err) => {
            if (err) return reject(err);
        });

        const query = `SELECT 1 FROM users WHERE username = ? OR email = ? LIMIT 1`;
        db.get(query, [identifier, identifier], (err, row: any) => {
            db.close();
            if (err) return reject(err);
            resolve(!!row);
        });
    });
}

export async function issueTokenForUser(userId: number, expiresInMinutes: number = 60): Promise<string> {
    const user = await getUserById(userId);
    if (!user) throw new Error("User not found");

    const newToken = new Token(userId, expiresInMinutes);
    const updatedTokens = [...user.tokens, newToken.toObject()];

    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(DB_PATH, (err) => {
            if (err) return reject(err);
        });

        db.run(`UPDATE users SET tokens = ? WHERE id = ?`, [JSON.stringify(updatedTokens), userId], (updateErr) => {
            db.close();
            if (updateErr) return reject(updateErr);
            resolve(newToken.value);
        });
    });
}

export async function verifyToken(tokenValue: string): Promise<number | null> {
    const db = new sqlite3.Database(DB_PATH);

    return new Promise((resolve, reject) => {
        db.all(`SELECT id, tokens FROM users`, (err, rows: any[]) => {
            db.close();
            if (err) return reject(err);

            for (const row of rows) {
                try {
                    const tokens = JSON.parse(row.tokens || '[]').map((t: any) => Token.fromObject(t));
                    const foundToken = tokens.find((t: Token) => t.value === tokenValue);

                    if (foundToken && foundToken.isValid()) {
                        return resolve(row.id);
                    }
                } catch (e) {
                    continue; 
                }
            }
            resolve(null);
        });
    });
}

export async function login(identifier: string, password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) return reject(err);
    });

    const query = `SELECT * FROM users WHERE username = ? OR email = ?`;
    
    db.get(query, [identifier, identifier], async (err, user: any) => {
      db.close();
      if (err) return reject(err);

      if (!user) return reject(new Error("Invalid credentials"));
      if (user.password !== password) return reject(new Error("Invalid credentials"));

      try {
        const token = await issueTokenForUser(user.id);
        resolve(token);
      } catch (issueErr: any) {
        reject(issueErr);
      }
    });
  });
}

export async function registerUser(username: string, email: string, password: string): Promise<string> {
    await createUser(username, email, password);

    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(DB_PATH, (err) => {
            if (err) return reject(err);
        });

        db.get(`SELECT id FROM users WHERE email = ?`, [email], async (err, row: any) => {
            db.close();
            if (err) return reject(err);
            if (!row) return reject(new Error("Registration failed: User not found"));

            try {
                const token = await issueTokenForUser(row.id);
                resolve(token);
            } catch (issueErr: any) {
                reject(issueErr);
            }
        });
    });
}
