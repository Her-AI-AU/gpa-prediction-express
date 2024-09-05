const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Sample route to get all users
app.get('/users', (req, res) => {
  const query = 'SELECT * FROM users';
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ users: rows });
  });
});

// Sample route to get a single user by ID
app.get('/users/:id', (req, res) => {
  const query = 'SELECT * FROM users WHERE id = ?';
  const params = [req.params.id];
  db.get(query, params, (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ user: row });
  });
});

// Sample route to create a new user
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  const query = 'INSERT INTO users (name, email) VALUES (?, ?)';
  const params = [name, email];
  db.run(query, params, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
});

// Sample route to update a user
app.put('/users/:id', (req, res) => {
  const { name, email } = req.body;
  const query = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
  const params = [name, email, req.params.id];
  db.run(query, params, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ changes: this.changes });
  });
});

// Sample route to delete a user
app.delete('/users/:id', (req, res) => {
  const query = 'DELETE FROM users WHERE id = ?';
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
