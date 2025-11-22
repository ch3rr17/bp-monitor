const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const moment = require('moment');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Database Setup
const db = new sqlite3.Database('bp_readings.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS readings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    systolic INTEGER,
    diastolic INTEGER,
    timestamp TEXT
  )`);
});

// Routes

// List View
app.get('/', (req, res) => {
  db.all("SELECT * FROM readings ORDER BY timestamp DESC", [], (err, rows) => {
    if (err) {
      return res.status(500).send("Database Error");
    }

    // Process rows to group by date and split AM/PM
    const grouped = {};

    rows.forEach(row => {
      const m = moment(row.timestamp);
      const dateKey = m.format('YYYY-MM-DD');
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = { date: m.format('MMM D, YYYY'), am: [], pm: [] };
      }

      const entry = {
        systolic: row.systolic,
        diastolic: row.diastolic,
        time: m.format('h:mm A')
      };

      // Check if AM or PM (before 12:00 is AM, 12:00 and after is PM)
      if (m.hours() < 12) {
        grouped[dateKey].am.push(entry);
      } else {
        grouped[dateKey].pm.push(entry);
      }
    });

    // Convert object to array and keep it sorted by date desc (keys might be unordered)
    // Since we iterated through sorted rows, the first encounter of a date is the most recent.
    // But object keys order isn't guaranteed in older JS, though mostly insertion order in modern.
    // Better to handle explicit sorting.
    
    const sortedGroups = Object.keys(grouped)
      .sort((a, b) => b.localeCompare(a)) // Descending date
      .map(key => grouped[key]);

    res.render('index', { groups: sortedGroups });
  });
});

// Entry Form
app.get('/add', (req, res) => {
  res.render('add');
});

// Handle Entry
app.post('/add', (req, res) => {
  const { systolic, diastolic } = req.body;
  const timestamp = moment().toISOString();

  db.run(`INSERT INTO readings (systolic, diastolic, timestamp) VALUES (?, ?, ?)`, 
    [systolic, diastolic, timestamp], 
    function(err) {
      if (err) {
        return console.error(err.message);
      }
      res.redirect('/');
    }
  );
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
