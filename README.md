# Blood Pressure Monitor

A simple application to track blood pressure readings.

## Features
- **Entry Form**: Capture Systolic and Diastolic numbers. Date/Time is automatically recorded.
- **List View**: View history of readings, grouped by Date and split into AM/PM columns.
- **Sorting**: Most recent entries appear at the top.

## Setup and Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   node server.js
   ```

3. Open your browser and navigate to:
   http://localhost:3000

## Structure
- `server.js`: Main application logic.
- `views/`: HTML templates (EJS).
- `public/`: Static assets (CSS).
- `bp_readings.db`: SQLite database file (created automatically).
