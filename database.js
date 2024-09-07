const sqlite3 = require("sqlite3").verbose();

// Create a new SQLite database or open an existing one
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error("Error opening database:", err);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// Create users table
db.serialize(() => {
  db.run(
    `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      target_score INTEGER
    )
  `,
    (err) => {
      if (err) {
        console.error("Error creating users table:", err);
      } else {
        console.log("Users table created or already exists.");
      }
    }
  );

  // Create subjects table
  db.run(
    `
    CREATE TABLE IF NOT EXISTS subjects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      semester TEXT,
      hurdle INTEGER,
      user_id INTEGER,
      score REAL,
      assessments_list TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `,
    (err) => {
      if (err) {
        console.error("Error creating subjects table:", err);
      } else {
        console.log("Subjects table created or already exists.");
      }
    }
  );

  // Create assessments table
  db.run(
    `
    CREATE TABLE IF NOT EXISTS assessments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      hurdle INTEGER,
      score REAL,
      description TEXT,
      user_id INTEGER,
      subject_id INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (subject_id) REFERENCES subjects(id)
    )
  `,
    (err) => {
      if (err) {
        console.error("Error creating assessments table:", err);
      } else {
        console.log("Assessments table created or already exists.");
      }
    }
  );
});

module.exports = db;
