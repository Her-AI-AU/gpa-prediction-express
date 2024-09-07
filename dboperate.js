const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.db");

db.serialize(() => {
  db.run("DROP TABLE users;");
  db.run("DROP TABLE subjects;");
  db.run("DROP TABLE assessments;");
});

db.close();
