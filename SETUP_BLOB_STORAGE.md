# Setting Up Blob Storage for BP Monitor

## Step 1: Navigate to Your BP Monitor Project

1. **Go to the Vercel Dashboard** (https://vercel.com/dashboard)
2. **Click on your "bp-monitor" project** (or whatever you named it)
   - NOT the "exif-photo-blog-main" project

## Step 2: Go to Storage

1. **Click "Storage" in the top navigation bar**
2. **Click "Create Database"** or **"Connect Store"**
3. **Select "Blob"**

## Step 3: Create a New Blob Store

1. **Name it**: `bp-monitor-blob` (or any name you prefer)
2. **Select Region**: Choose the same region as your project (probably `iad1` - US East)
3. **Click "Create"**

## Step 4: Connect to Your Project

1. **After creation, you'll see a "Connect Project" button**
2. **Click it and select "bp-monitor"**
3. **Vercel will automatically create the `BLOB_READ_WRITE_TOKEN` environment variable**

## Step 5: Get the Token

1. **Go to your bp-monitor project**
2. **Click "Settings" in the top nav**
3. **Click "Environment Variables" in the left sidebar**
4. **You should now see `BLOB_READ_WRITE_TOKEN`**
5. **Click to reveal and copy the value**

## Step 6: Add to Local Environment

1. **Create a `.env.local` file** in your project root
2. **Add the token**:
   ```
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_XXXXXXXXXXXXXXXX
   ```

## Alternative: Use Vercel CLI to Pull Env Variables

```bash
vercel env pull .env.local
```

This will automatically download all environment variables including the blob token.

---

## Why This Works

- Your SQLite database will be stored in Vercel Blob Storage
- Every time your serverless function runs, it downloads the latest database
- After making changes, it uploads the updated database
- This makes your data accessible from any deployment and any device!

---

## Next Steps After Setup

1. Get the token
2. Add it to `.env.local` locally
3. Redeploy to Vercel (it will automatically have access to the token)
4. Your data will now persist across all devices and deployments!

