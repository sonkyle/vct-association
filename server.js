const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const db = new Database('database.db');
const sessionId = require('crypto').randomUUID();
module.exports = app;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

db.exec(`
  CREATE TABLE IF NOT EXISTS responses (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id  TEXT NOT NULL,
    image_index INTEGER NOT NULL,
    answer      TEXT NOT NULL,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

app.post('/api/answer', (req, res) => {
    const { sessionId, imageIndex, answer } = req.body;
    const stmt = db.prepare('INSERT INTO responses (session_id, image_index, answer) VALUES (?, ?, ?)');
    stmt.run(sessionId, imageIndex, answer);
    res.json({ success: true });
});

app.get('/api/responses', (req, res) => {
    const rows = db.prepare('SELECT * FROM responses ORDER BY image_index ASC').all();
    res.json(rows);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));