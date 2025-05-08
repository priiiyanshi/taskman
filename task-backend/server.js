const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,  
  database: process.env.DB_NAME,
});


db.connect((err) => {
  if (err) {
    console.error('Error connecting to DB:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

app.use(cors());
app.use(express.json());


app.get('/tasks', (req, res) => {
  db.query('SELECT * FROM tasks', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});


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

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
