const { put, head, getDownloadUrl } = require('@vercel/blob');
const sqlite3 = require('sqlite3');
const { readFileSync, writeFileSync, existsSync } = require('fs');
const { promisify } = require('util');

const DB_BLOB_KEY = 'bp_readings.db';
const LOCAL_DB_PATH = '/tmp/bp_readings.db';

/**
 * Downloads the database from Blob Storage if it exists, or creates a new one
 */
async function ensureDatabase(): Promise<any> {
  const dbPath = process.env.VERCEL ? LOCAL_DB_PATH : './bp_readings.db';
  
  // On Vercel, try to download from Blob Storage
  if (process.env.VERCEL && process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      // Check if blob exists and download it
      try {
        await head(DB_BLOB_KEY, { token: process.env.BLOB_READ_WRITE_TOKEN });
        
        // Get download URL and fetch the file
        const downloadUrl = await getDownloadUrl(DB_BLOB_KEY);
        const response = await fetch(downloadUrl);
        if (!response.ok) {
          throw new Error(`Failed to download database: ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        writeFileSync(dbPath, buffer);
        console.log('Database downloaded from Blob Storage');
      } catch (error: any) {
        // Blob doesn't exist yet, create new database
        if (error.statusCode === 404 || error.name === 'BlobNotFoundError') {
          console.log('Database not found in Blob Storage, creating new one');
        } else {
          console.error('Error downloading database from Blob Storage:', error);
        }
      }
    } catch (error) {
      console.error('Error downloading database:', error);
    }
  }

  const db = new sqlite3.Database(dbPath);
  
  // Initialize schema
  const run = promisify(db.run.bind(db));
  
  await run(`CREATE TABLE IF NOT EXISTS readings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    systolic INTEGER,
    diastolic INTEGER,
    heart_rate INTEGER,
    timestamp TEXT,
    edited_at TEXT
  )`).catch(() => {});
  
  await run(`ALTER TABLE readings ADD COLUMN heart_rate INTEGER`).catch(() => {});
  await run(`ALTER TABLE readings ADD COLUMN edited_at TEXT`).catch(() => {});
  
  return db;
}

/**
 * Uploads the database to Blob Storage (only on Vercel)
 */
async function syncDatabaseToBlob(): Promise<void> {
  if (!process.env.VERCEL || !process.env.BLOB_READ_WRITE_TOKEN) {
    return; // Skip on local development
  }

  try {
    if (!existsSync(LOCAL_DB_PATH)) {
      return; // No database file to upload
    }

    const dbBuffer = readFileSync(LOCAL_DB_PATH);
    
    await put(DB_BLOB_KEY, dbBuffer, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
      addRandomSuffix: false, // Keep same filename
    });
    
    console.log('Database synced to Blob Storage');
  } catch (error) {
    console.error('Error syncing database to Blob Storage:', error);
    // Don't throw - we don't want to fail the request if sync fails
  }
}

module.exports = { ensureDatabase, syncDatabaseToBlob };
