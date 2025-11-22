import type { VercelRequest, VercelResponse } from '@vercel/node';
import moment from 'moment';
import { ensureDatabase, syncDatabaseToBlob } from '../db-utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;
  const { systolic, diastolic, heartRate } = req.body;
  
  if (!systolic || !diastolic) {
    return res.status(400).json({ error: 'Systolic and diastolic are required' });
  }

  const db = await ensureDatabase();

  try {
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
  } catch (error: any) {
    console.error('Database error:', error);
    res.status(500).json({ error: error.message || 'Database Error' });
  } finally {
    db.close();
  }
}

