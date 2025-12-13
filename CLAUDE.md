# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Blood Pressure Monitor is a full-stack React + TypeScript application for tracking blood pressure readings. The app runs in two environments:

1. **Local Development**: Express server (`server.ts`) with SQLite3 database
2. **Production (Vercel)**: Serverless functions (`api/`) with Vercel Blob Storage for database persistence

## Common Development Commands

### Development Mode (Two Terminals Required)
```bash
# Terminal 1: Start backend server
npm run dev:server

# Terminal 2: Start Vite dev server
npm run dev
```
Access at: http://localhost:5173

### Production Build & Run
```bash
npm run build
NODE_ENV=production npm run server
```
Access at: http://localhost:3000

### Build Frontend Only
```bash
npm run build
```

## Architecture

### Dual Runtime Environment

This application has **two separate backend implementations**:

1. **`server.ts`** - Local development Express server
   - Direct SQLite3 database access
   - Runs on port 3000
   - Used with `npm run dev:server`

2. **`api/` directory** - Vercel serverless functions
   - `api/readings.ts` - Main handler for GET/POST requests
   - `api/readings/[id].ts` - Handler for PUT/DELETE requests on specific readings
   - `api/db-utils.ts` - Database management with Blob Storage sync
   - Downloads database from Vercel Blob Storage on cold starts
   - Syncs back to Blob Storage after writes

**CRITICAL**: When modifying API logic, you must update BOTH `server.ts` AND the corresponding `api/` files to maintain consistency between local and production environments.

### Database Schema

SQLite table `readings`:
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `systolic` (INTEGER)
- `diastolic` (INTEGER)
- `heart_rate` (INTEGER, nullable)
- `timestamp` (TEXT, ISO 8601 format)
- `edited_at` (TEXT, ISO 8601 format, nullable)

### Data Flow

1. **Frontend** (`src/`):
   - React 19 with TypeScript
   - Client-side routing via React Router DOM
   - API calls through `src/api.ts`

2. **API Layer**:
   - Development: Vite proxies `/api` requests to Express server (port 3000)
   - Production: Vercel routes `/api` to serverless functions

3. **Backend Logic**:
   - Groups readings by date
   - Splits readings into AM (< 12:00) and PM (>= 12:00)
   - Returns sorted by date descending

### Frontend Components

- `App.tsx` - Root component with routing
- `Index.tsx` - Main page displaying readings grouped by date/time
- `AddEntry.tsx` - Form to add new blood pressure readings
- `EditEntry.tsx` - Modal for editing existing readings
- `utils/pdfExport.ts` - PDF export functionality using jsPDF

### Styling

- Tailwind CSS v4 (using `@tailwindcss/postcss`)
- Custom theme variables in `src/index.css`
- Responsive design with mobile-first approach

## Deployment

### Vercel Setup Requirements

1. **Blob Storage**: Required for database persistence across serverless function invocations
   - Create in Vercel project: Storage tab → Create Database → Blob
   - Environment variable: `BLOB_READ_WRITE_TOKEN`

2. **Build Configuration**: Defined in `vercel.json`
   - Frontend builds to `dist/`
   - Serverless functions in `api/` use `@vercel/node` runtime

See `VERCEL_DEPLOY.md` for complete deployment instructions.

## Key Implementation Details

### Time Formatting
- Uses Moment.js for all date/time operations
- Server stores timestamps in ISO 8601 format
- Display format: "MMM D, YYYY" for dates, "h:mm A" for times

### CORS Handling
- Serverless functions (`api/`) include CORS headers for cross-origin requests
- Local server doesn't need CORS (same-origin via Vite proxy)

### Database Migrations
Both `server.ts` and `api/db-utils.ts` include inline migrations:
- Adds `heart_rate` column if missing (ignores duplicate column errors)
- Adds `edited_at` column if missing (ignores duplicate column errors)

### Vite Configuration
- API routes excluded from frontend bundle via `rollupOptions.external`
- Code splitting: React/Router in one chunk, PDF libraries in another
- Proxy setup for local development API calls

## Development Workflow

When making changes:

1. **API Changes**: Update both `server.ts` and corresponding `api/` files
2. **Component Changes**: Only update `src/` files
3. **Type Changes**: Update `src/types.ts` (shared between frontend and backend)
4. **Database Schema Changes**: Update schema initialization in both `server.ts` and `api/db-utils.ts`

## Testing Changes

Always test in both environments:
1. Local: `npm run dev:server` + `npm run dev`
2. Production build: `npm run build` + `NODE_ENV=production npm run server`
