const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const db = new sqlite3.Database('/app/data/bios.db', (err) => {
  if (err) console.error(err.message);
  console.log('Connected to SQLite database.');
});

db.run(`CREATE TABLE IF NOT EXISTS bios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  company TEXT NOT NULL,
  about_me TEXT NOT NULL,
  zoom_id TEXT NOT NULL UNIQUE
)`);

app.get('/', (req, res) => {
  db.all('SELECT * FROM bios', [], (err, bios) => {
    if (err) throw err;
    res.render('index', { bios });
  });
});

app.get('/add', (req, res) => {
  res.render('add', { error: null });
});

app.post('/add', (req, res) => {
  const { first_name, last_name, company, about_me, zoom_id } = req.body;
  db.run(
    'INSERT INTO bios (first_name, last_name, company, about_me, zoom_id) VALUES (?, ?, ?, ?, ?)',
    [first_name, last_name, company, about_me, zoom_id],
    function (err) {
      if (err) {
        return res.render('add', { error: 'Zoom ID already exists or invalid input.' });
      }
      res.redirect('/');
    }
  );
});

app.listen(3000, () => console.log('Server running on port 3000'));