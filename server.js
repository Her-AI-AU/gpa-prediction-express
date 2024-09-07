const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.get("/users", (req, res) => {
  const query = "SELECT * FROM users";
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ users: rows });
  });
});

app.get("/users/:id", (req, res) => {
  const query = "SELECT * FROM users WHERE id = ?";
  const params = [req.params.id];
  db.get(query, params, (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ user: row });
  });
});

app.post("/users", (req, res) => {
  const { name, email } = req.body;
  const query = "INSERT INTO users (name, email) VALUES (?, ?)";
  const params = [name, email];
  db.run(query, params, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
});

app.put("/users/:id", (req, res) => {
  const { target_score } = req.body;
  const query = "UPDATE users SET target_score = ? WHERE id = ?";
  const params = [target_score, req.params.id];
  db.run(query, params, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ changes: this.changes });
  });
});

app.get("/subjects", (req, res) => {
  const query = "SELECT * FROM subjects";
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ subjects: rows });
  });
});
app.get("/subjects/:id", (req, res) => {
  const query = "SELECT * FROM subjects WHERE id = ?";
  const params = [req.params.id];
  db.get(query, params, (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ subject: row });
  });
});
app.post("/subjects", (req, res) => {
  const { name, semester, user_id } = req.body;
  const query =
    "INSERT INTO subjects (name, semester, user_id) VALUES (?, ?, ?)";
  const params = [name, semester, user_id];
  db.run(query, params, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
});
app.put("/subjects/:id", (req, res) => {
  const { name, semester, hurdle, user_id, score, assessments_list } = req.body;
  const query =
    "UPDATE subjects SET name = ?, semester = ?, hurdle = ?, user_id = ?, score = ?, assessments_list = ? WHERE id = ?";
  const params = [
    name,
    semester,
    hurdle,
    user_id,
    score,
    assessments_list,
    req.params.id,
  ];
  db.run(query, params, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ changes: this.changes });
  });
});
app.delete("/subjects/:id", (req, res) => {
  const query = "DELETE FROM subjects WHERE id = ?";
  const params = [req.params.id];
  db.run(query, params, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ changes: this.changes });
  });
});

app.get("/assessments", (req, res) => {
  const query = "SELECT * FROM assessments";
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ assessments: rows });
  });
});
app.get("/assessments/:id", (req, res) => {
  const query = "SELECT * FROM assessments WHERE id = ?";
  const params = [req.params.id];
  db.get(query, params, (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ assessment: row });
  });
});
app.post("/assessments", (req, res) => {
  const { name, user_id, subject_id, description } = req.body;
  const query =
    "INSERT INTO assessments (name, user_id, subject_id, description) VALUES (?, ?, ?, ?)";
  const params = [name, user_id, subject_id, description];
  db.run(query, params, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
});
app.put("/assessments/:id", (req, res) => {
  const { name, user_id, subject_id, hurdle, score, description } = req.body;
  const query =
    "UPDATE assessments SET name = ?, user_id = ?, subject_id = ?, hurdle = ?, score = ?, description = ? WHERE id = ?";
  const params = [
    name,
    user_id,
    subject_id,
    hurdle,
    score,
    description,
    req.params.id,
  ];
  db.run(query, params, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ changes: this.changes });
  });
});
app.delete("/assessments/:id", (req, res) => {
  const query = "DELETE FROM assessments WHERE id = ?";
  const params = [req.params.id];
  db.run(query, params, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ changes: this.changes });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
