# Vercel Blob Storage Setup Guide

This guide will help you set up Vercel Blob Storage so your blood pressure data persists across deployments and function invocations.

## Why Blob Storage?

Vercel serverless functions use ephemeral storage (`/tmp`), which means data is lost when:
- Functions restart
- New deployments occur
- Functions go idle

Blob Storage provides persistent cloud storage for your SQLite database.

---

## Step-by-Step Setup

### Step 1: Create Blob Storage in Vercel

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign in to your account
   - Click on your **bp-monitor** project

2. **Navigate to Storage**
   - In the left sidebar, click **"Storage"**
   - Click the **"Create Database"** button (or **"Create"** if you see it)

3. **Select Blob Storage**
   - Choose **"Blob"** as the storage type
   - **Name**: `bp-monitor-storage` (or any name you prefer)
   - Click **"Create"**

4. **Wait for Creation**
   - Vercel will create the Blob Storage (takes a few seconds)
   - You'll see it listed in the Storage tab

---

### Step 2: Get the Blob Token

1. **Open Your Blob Storage**
   - Click on the Blob Storage you just created (`bp-monitor-storage`)

2. **Go to Settings**
   - Click the **"Settings"** tab
   - Look for **"Token"** or **"Access Token"**

3. **Copy the Token**
   - You'll see a token that looks like: `vercel_blob_xxxxx_xxxxx`
   - Copy this token (you'll need it in the next step)
   - **Note**: Vercel may auto-add this to environment variables, but check to be sure

---

### Step 3: Add Environment Variable

1. **Go to Project Settings**
   - In your Vercel project, click **"Settings"** in the top navigation
   - Click **"Environment Variables"** in the left sidebar

2. **Add the Token**
   - Click **"Add New"** or **"Add"** button
   - **Key**: `BLOB_READ_WRITE_TOKEN`
   - **Value**: Paste the token you copied (starts with `vercel_blob_`)
   - **Environment**: Select **ALL THREE**:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
   - Click **"Save"**

3. **Verify It's Added**
   - You should see `BLOB_READ_WRITE_TOKEN` in the environment variables list
   - Make sure it's enabled for all environments

---

### Step 4: Redeploy Your Application

After adding the environment variable, you need to redeploy:

**Option A: Redeploy from Dashboard**
1. Go to **"Deployments"** tab
2. Click the **"..."** (three dots) menu on your latest deployment
3. Click **"Redeploy"**
4. Make sure **"Use existing Build Cache"** is **unchecked** (to ensure new env vars are picked up)
5. Click **"Redeploy"**

**Option B: Push a New Commit**
```bash
# Make a small change (like adding a comment) and push
git add .
git commit -m "Trigger redeploy with Blob Storage env var"
git push
```

**Option C: Force Redeploy via CLI**
```bash
vercel --prod --force
```

---

### Step 5: Verify It's Working

1. **Wait for Deployment**
   - The deployment will take 2-3 minutes
   - Watch the build logs to ensure it completes successfully

2. **Test Data Persistence**
   - Visit your app: `https://bp-monitor-ten.vercel.app` (or your URL)
   - **Add a new blood pressure reading**
   - **Refresh the page** - the data should still be there!
   - **Wait a few minutes and refresh again** - data should persist
   - **Check after a new deployment** - data should still be there

3. **Check Function Logs** (Optional)
   - Go to **"Deployments"** → Click on your deployment
   - Click **"Functions"** tab
   - Click on a function (e.g., `api/readings`)
   - Look for log messages like:
     - `"Database downloaded from Blob Storage"` (on first load)
     - `"Database synced to Blob Storage"` (after writes)

---

## How It Works

Your application automatically:

1. **On First Load**: Downloads the database from Blob Storage (if it exists)
2. **On Write Operations**: 
   - Saves data to local SQLite file (`/tmp/bp_readings.db`)
   - Uploads the database file to Blob Storage
3. **On Next Load**: Downloads the latest database from Blob Storage

This ensures your data persists even when:
- Functions restart
- New deployments occur
- Functions go idle

---

## Troubleshooting

### Data Not Persisting?

1. **Check Environment Variable**
   - Go to Settings → Environment Variables
   - Verify `BLOB_READ_WRITE_TOKEN` exists and is enabled for all environments
   - Make sure you redeployed after adding it

2. **Check Function Logs**
   - Go to Deployments → Your deployment → Functions
   - Look for errors like:
     - `"Error downloading database from Blob Storage"`
     - `"Error syncing database to Blob Storage"`
   - These indicate the token might be wrong or Blob Storage isn't set up

3. **Verify Blob Storage Exists**
   - Go to Storage tab
   - Make sure your Blob Storage is listed
   - Click on it to see if files are being uploaded

4. **Check Token Format**
   - Token should start with `vercel_blob_`
   - Make sure there are no extra spaces when copying

### Still Having Issues?

- **Clear and Recreate**: Delete the Blob Storage and create a new one
- **Check Token Permissions**: Make sure the token has read/write access
- **Redeploy**: Always redeploy after changing environment variables

---

## Quick Reference

**Environment Variable:**
- Name: `BLOB_READ_WRITE_TOKEN`
- Value: Your Blob Storage token (from Storage → Settings)
- Environments: Production, Preview, Development

**Blob Storage:**
- Type: Blob
- Name: `bp-monitor-storage` (or your choice)
- File: `bp_readings.db`

**After Setup:**
- ✅ Data persists across deployments
- ✅ Data persists when functions restart
- ✅ Data persists when functions go idle
- ✅ Multiple users share the same database

---

That's it! Your data should now persist in the cloud. 🎉

