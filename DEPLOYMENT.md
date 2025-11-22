# Vercel Deployment Guide

## Prerequisites

- A GitHub account
- A Vercel account (sign up at [vercel.com](https://vercel.com))

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Go to Vercel Dashboard**:
   - Visit [vercel.com](https://vercel.com)
   - Click "Add New..." → "Project"
   - Import your GitHub repository

3. **Configure Project**:
   - Framework Preset: Vite
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `dist` (auto-detected)
   - Install Command: `npm install` (auto-detected)

4. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Link to existing project or create new
   - Confirm settings
   - Deploy

5. **For production deployment**:
   ```bash
   vercel --prod
   ```

## Important Notes

### Database Storage

✅ **Current Setup**: The SQLite database is automatically synced to **Vercel Blob Storage** for persistence.

**How it works:**
- Database file is stored in Blob Storage (persistent)
- On each function invocation, the database is downloaded from Blob Storage
- After any write operation (POST/PUT), the database is uploaded back to Blob Storage
- This ensures data persists across deployments and function invocations

**Setup Required:**
- Create a Blob Storage in your Vercel project
- Add `BLOB_READ_WRITE_TOKEN` environment variable (see Environment Variables section above)

**Note:** This solution works well for MVP and moderate usage. For high-traffic production applications, consider migrating to a dedicated database service like Vercel Postgres or Turso for better performance.

### Environment Variables

**Required for Data Persistence:**

1. **Set up Vercel Blob Storage**:
   - Go to your Vercel project dashboard
   - Navigate to **Storage** tab
   - Click **Create Database** → Select **Blob**
   - Name it (e.g., `bp-monitor-storage`)
   - Create it

2. **Add Environment Variable**:
   - Go to **Settings** → **Environment Variables**
   - Add: `BLOB_READ_WRITE_TOKEN`
   - Value: Copy from your Blob storage settings (or it may be auto-added)
   - Apply to: **Production**, **Preview**, and **Development**
   - Click **Save**

3. **Redeploy** your application for changes to take effect

**How it works:**
- The database file is automatically synced to Vercel Blob Storage after each write operation
- On function start, the database is downloaded from Blob Storage if it exists
- This ensures your data persists across deployments and function invocations

## Troubleshooting

### Build Fails

- Check build logs in Vercel Dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript compilation passes locally: `npm run build`

### API Routes Not Working

- Verify `api/` directory structure is correct
- Check that `@vercel/node` is installed
- Review function logs in Vercel Dashboard

### Database Issues

- Remember: `/tmp` storage is ephemeral
- Consider migrating to a persistent database service
- Check function logs for database errors

## Local Development

The local development setup remains the same:

```bash
# Terminal 1: Backend
npm run dev:server

# Terminal 2: Frontend
npm run dev
```

The Vercel serverless functions are only used in production deployment.

