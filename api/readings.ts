const { VercelRequest, VercelResponse } = require('@vercel/node');
const moment = require('moment');
const { promisify } = require('util');
const { ensureDatabase, syncDatabaseToBlob } = require('./db-utils');

module.exports = async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const db = await ensureDatabase();
  const all = promisify(db.all.bind(db));

  try {
    if (req.method === 'GET') {
      // Get all readings
      const rows: any[] = await all("SELECT * FROM readings ORDER BY timestamp DESC");
      
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

        if (m.hours() < 12) {
          grouped[dateKey].am.push(entry);
        } else {
          grouped[dateKey].pm.push(entry);
        }
      });

      const sortedGroups = Object.keys(grouped)
        .sort((a, b) => b.localeCompare(a))
        .map(key => grouped[key]);

      res.json(sortedGroups);
    } else if (req.method === 'POST') {
      // Create a new reading
      const { systolic, diastolic, heartRate } = req.body;
      
      if (!systolic || !diastolic) {
        return res.status(400).json({ error: 'Systolic and diastolic are required' });
      }

      const timestamp = moment().toISOString();

      await new Promise<void>((resolve, reject) => {
        db.run(
          `INSERT INTO readings (systolic, diastolic, heart_rate, timestamp) VALUES (?, ?, ?, ?)`,
          [systolic, diastolic, heartRate || null, timestamp],
          function(err: Error | null) {
            if (err) reject(err);
            else resolve();
          }
        );
      });

      // Sync database to Blob Storage after write
      await syncDatabaseToBlob();
      
      res.status(201).json({ success: true });
    } else if (req.method === 'PUT') {
      // Update a reading
      const { id } = req.query;
      const { systolic, diastolic, heartRate } = req.body;
      
      if (!systolic || !diastolic) {
        return res.status(400).json({ error: 'Systolic and diastolic are required' });
      }

      const editedAt = moment().toISOString();

      const result = await new Promise<{ changes: number }>((resolve, reject) => {
        db.run(
          `UPDATE readings SET systolic = ?, diastolic = ?, heart_rate = ?, edited_at = ? WHERE id = ?`,
          [systolic, diastolic, heartRate || null, editedAt, id],
          function(this: { changes: number }, err: Error | null) {
            if (err) reject(err);
            else resolve({ changes: this.changes });
          }
        );
      });

      if (result.changes === 0) {
        return res.status(404).json({ error: 'Reading not found' });
      }

      // Sync database to Blob Storage after write
      await syncDatabaseToBlob();
      
      res.json({ success: true });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error: any) {
    console.error('Database error:', error);
    res.status(500).json({ error: error.message || 'Database Error' });
  } finally {
    db.close();
  }
};
