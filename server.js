require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "todolist_db",
  password: "todolist_", // Replace with your MySQL password
  database: "todolist_db",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// Routes
app.get("/", (req, res) => {
  res.send("Todo List API is running...");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Get all tasks
app.get("/tasks", (req, res) => {
  db.query("SELECT * FROM tasks", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Add a new task
app.post("/tasks", (req, res) => {
  const { description } = req.body;
  db.query(
    "INSERT INTO tasks (description) VALUES (?)",
    [description],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, description });
    }
  );
});

// Edit a task
app.put("/tasks/:id", (req, res) => {
  const { description } = req.body;
  const { id } = req.params;
  db.query(
    "UPDATE tasks SET description = ? WHERE id = ?",
    [description, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Task updated successfully" });
    }
  );
});

// Delete a task
app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM tasks WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Task deleted successfully" });
  });
});
