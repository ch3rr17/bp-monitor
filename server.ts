import express, { Request, Response } from 'express';
import sqlite3 from 'sqlite3';
import moment from 'moment';
import path from 'path';

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Database Setup
const db = new sqlite3.Database('bp_readings.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS readings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    systolic INTEGER,
    diastolic INTEGER,
    heart_rate INTEGER,
    timestamp TEXT,
    edited_at TEXT
  )`);
  
  // Add heart_rate column if it doesn't exist (migration for existing databases)
  db.run(`ALTER TABLE readings ADD COLUMN heart_rate INTEGER`, (err) => {
    // Ignore error if column already exists
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Migration error:', err);
    }
  });
  
  // Add edited_at column if it doesn't exist (migration for existing databases)
  db.run(`ALTER TABLE readings ADD COLUMN edited_at TEXT`, (err) => {
    // Ignore error if column already exists
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Migration error:', err);
    }
  });
});

// API Routes

// Get all readings grouped by date
app.get('/api/readings', (_req: Request, res: Response) => {
  db.all("SELECT * FROM readings ORDER BY timestamp DESC", [], (err, rows: any[]) => {
    if (err) {
      return res.status(500).json({ error: "Database Error" });
    }

    // Process rows to group by date and split AM/PM
    const grouped: Record<string, { date: string; am: any[]; pm: any[] }> = {};

    rows.forEach(row => {
      const m = moment(row.timestamp);
      const dateKey = m.format('YYYY-MM-DD');
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = { date: m.format('MMM D, YYYY'), am: [], pm: [] };
      }

      const entry = {
        id: row.id,
        systolic: row.systolic,
        diastolic: row.diastolic,
        heartRate: row.heart_rate || null,
        time: m.format('h:mm A'),
        editedAt: row.edited_at || null
      };

      // Check if AM or PM (before 12:00 is AM, 12:00 and after is PM)
      if (m.hours() < 12) {
        grouped[dateKey].am.push(entry);
      } else {
        grouped[dateKey].pm.push(entry);
      }
    });

    // Convert object to array and keep it sorted by date desc
    const sortedGroups = Object.keys(grouped)
      .sort((a, b) => b.localeCompare(a)) // Descending date
      .map(key => grouped[key]);

    res.json(sortedGroups);
  });
});

// Create a new reading
app.post('/api/readings', (req: Request, res: Response) => {
  const { systolic, diastolic, heartRate } = req.body;
  
  if (!systolic || !diastolic) {
    return res.status(400).json({ error: 'Systolic and diastolic are required' });
  }

  const timestamp = moment().toISOString();

  db.run(
    `INSERT INTO readings (systolic, diastolic, heart_rate, timestamp) VALUES (?, ?, ?, ?)`,
    [systolic, diastolic, heartRate || null, timestamp],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID, systolic, diastolic, heartRate: heartRate || null, timestamp });
    }
  );
});

// Update a reading
app.put('/api/readings/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { systolic, diastolic, heartRate } = req.body;
  
  if (!systolic || !diastolic) {
    return res.status(400).json({ error: 'Systolic and diastolic are required' });
  }

  const editedAt = moment().toISOString();

  db.run(
    `UPDATE readings SET systolic = ?, diastolic = ?, heart_rate = ?, edited_at = ? WHERE id = ?`,
    [systolic, diastolic, heartRate || null, editedAt, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Reading not found' });
      }
      res.json({ id: parseInt(id), systolic, diastolic, heartRate: heartRate || null, editedAt });
    }
  );
});

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  
  // Serve React app for all non-API routes
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

