const express = require("express");
const cors = require("cors");
const db = require("./database");
const bcrypt = require("bcrypt");

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
// User authentication route
app.post("/login", async (req, res) => {
  const { student_id, password } = req.body;
  const query = "SELECT * FROM users WHERE student_id = ?";
  db.get(query, [student_id], async (err, user) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    res.json({
      user: { id: user.id, name: user.name, student_id: user.student_id },
    });
  });
});

app.post("/register", async (req, res) => {
  const { name, student_id, password } = req.body;

  // Check if user already exists
  const checkUserQuery = "SELECT * FROM users WHERE student_id = ?";
  db.get(checkUserQuery, [student_id], async (err, user) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (user) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const insertUserQuery = "INSERT INTO users (name, student_id, password) VALUES (?, ?, ?)";
    db.run(insertUserQuery, [name, student_id, hashedPassword], function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        user: { id: this.lastID, name, student_id },
        message: "User registered successfully",
      });
    });
  });
});

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
  const { name, student_id } = req.body;
  const query = "INSERT INTO users (name, student_id) VALUES (?, ?)";
  const params = [name, student_id];
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
// to get subjects by user_id
app.get("/subjects/:userId", (req, res) => {
  const userId = req.params.userId;

  db.all(
    `
    SELECT * FROM subjects WHERE user_id = ?
  `,
    [userId],
    (err, rows) => {
      if (err) {
        console.error("Error querying subjects:", err);
        res.status(500).json({ error: "Failed to retrieve subjects" });
      } else {
        res.status(200).json({ subjects: rows });
      }
    }
  );
});
// to get subject by id
app.get("/subject/:id", (req, res) => {
  const id = req.params.id;

  db.all(
    `
    SELECT * FROM subjects WHERE id = ?
  `,
    [id],
    (err, rows) => {
      if (err) {
        console.error("Error querying subjects:", err);
        res.status(500).json({ error: "Failed to retrieve subjects" });
      } else {
        res.status(200).json({ subject: rows });
      }
    }
  );
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
  const { name, semester, hurdle, score, assessments_list, weight, target_score } = req.body;
  const fields = [];
  const params = [];

  if (name !== undefined) {
    fields.push("name = ?");
    params.push(name);
  }
  if (semester !== undefined) {
    fields.push("semester = ?");
    params.push(semester);
  }
  if (hurdle !== undefined) {
    fields.push("hurdle = ?");
    params.push(hurdle);
  }
  if (score !== undefined) {
    fields.push("score = ?");
    params.push(score);
  }
  if (assessments_list !== undefined) {
    fields.push("assessments_list = ?");
    params.push(assessments_list);
  }
  if (weight !== undefined) {
    fields.push("weight = ?");
    params.push(weight);
  }
  if (target_score !== undefined) {
    fields.push("target_score = ?");
    params.push(target_score);
  }

  if (fields.length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }

  const query = `UPDATE subjects SET ${fields.join(", ")} WHERE id = ?`;
  params.push(req.params.id);

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
// to get assessment by id
app.get("/assessment/:id", (req, res) => {
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
// to get assessments by subject_id
app.get("/assessments/:subject_id", (req, res) => {
  const query = "SELECT * FROM assessments WHERE subject_id = ?";
  const params = [req.params.subject_id];
  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ assessments: rows });
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
  const { name, hurdle, score, rate, description } = req.body;
  const fields = [];
  const params = [];

  if (name !== undefined) {
    fields.push("name = ?");
    params.push(name);
  }
  if (hurdle !== undefined) {
    fields.push("hurdle = ?");
    params.push(hurdle);
  }
  if (score !== undefined) {
    fields.push("score = ?");
    params.push(score);
  }
  if (rate !== undefined) {
    fields.push("rate = ?");
    params.push(rate);
  }
  if (description !== undefined) {
    fields.push("description = ?");
    params.push(description);
  }

  if (fields.length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }

  const query = `UPDATE assessments SET ${fields.join(", ")} WHERE id = ?`;
  params.push(req.params.id);

  db.run(query, params, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
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
  console.log(`Server is running on ${port}`);
});
