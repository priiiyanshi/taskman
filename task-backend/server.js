const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = 5000;

// Connect to MySQL database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Firebolt_19',  // ⬅️ Add this line!
  database: 'taskmanager'
});


db.connect((err) => {
  if (err) {
    console.error('❌ Error connecting to DB:', err);
    return;
  }
  console.log('✅ Connected to MySQL database');
});

app.use(cors());
app.use(express.json());

// GET all tasks
app.get('/tasks', (req, res) => {
  db.query('SELECT * FROM tasks', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// POST a new task
app.post('/tasks', (req, res) => {
  const { title, description } = req.body;
  db.query(
    'INSERT INTO tasks (title, description) VALUES (?, ?)',
    [title, description],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.status(201).json({ id: result.insertId });
    }
  );
});

// PUT (mark task as complete)
app.put('/tasks/:id/complete', (req, res) => {
  const { id } = req.params;
  db.query(
    'UPDATE tasks SET is_completed = TRUE WHERE id = ?',
    [id],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ message: 'Task marked as completed' });
    }
  );
});

// DELETE a task
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.query(
    'DELETE FROM tasks WHERE id = ?',
    [id],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.status(204).send();
    }
  );
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
