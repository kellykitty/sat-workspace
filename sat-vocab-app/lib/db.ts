import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'sat-vocab.db');
let db: Database.Database | null = null;

export function getDb() {
  if (!db) {
    db = new Database(dbPath);
    initializeDatabase();
  }
  return db;
}

function initializeDatabase() {
  const db = getDb();

  // Create users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create user_performance table
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_performance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      word_id INTEGER NOT NULL,
      correct INTEGER DEFAULT 0,
      incorrect INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE(user_id, word_id)
    )
  `);

  // Create index for faster lookups
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_user_performance_user_id
    ON user_performance(user_id)
  `);

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_user_performance_word_id
    ON user_performance(word_id)
  `);
}

// User operations
export interface User {
  id: number;
  username: string;
  password_hash: string;
  created_at: string;
}

export function createUser(username: string, passwordHash: string): User | null {
  const db = getDb();
  try {
    const stmt = db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)');
    const result = stmt.run(username, passwordHash);

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid) as User;
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

export function getUserByUsername(username: string): User | null {
  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as User | undefined;
  return user || null;
}

export function getUserById(id: number): User | null {
  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | undefined;
  return user || null;
}

// User performance operations
export interface UserPerformanceRecord {
  user_id: number;
  word_id: number;
  correct: number;
  incorrect: number;
}

export function getUserPerformance(userId: number): Record<number, { correct: number; incorrect: number }> {
  const db = getDb();
  const records = db.prepare('SELECT word_id, correct, incorrect FROM user_performance WHERE user_id = ?')
    .all(userId) as UserPerformanceRecord[];

  const performance: Record<number, { correct: number; incorrect: number }> = {};
  records.forEach(record => {
    performance[record.word_id] = {
      correct: record.correct,
      incorrect: record.incorrect
    };
  });

  return performance;
}

export function updateUserWordPerformance(userId: number, wordId: number, isCorrect: boolean): void {
  const db = getDb();

  // Try to get existing record
  const existing = db.prepare('SELECT * FROM user_performance WHERE user_id = ? AND word_id = ?')
    .get(userId, wordId) as UserPerformanceRecord | undefined;

  if (existing) {
    // Update existing record
    const column = isCorrect ? 'correct' : 'incorrect';
    db.prepare(`UPDATE user_performance SET ${column} = ${column} + 1 WHERE user_id = ? AND word_id = ?`)
      .run(userId, wordId);
  } else {
    // Insert new record
    const correct = isCorrect ? 1 : 0;
    const incorrect = isCorrect ? 0 : 1;
    db.prepare('INSERT INTO user_performance (user_id, word_id, correct, incorrect) VALUES (?, ?, ?, ?)')
      .run(userId, wordId, correct, incorrect);
  }
}

export function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}
