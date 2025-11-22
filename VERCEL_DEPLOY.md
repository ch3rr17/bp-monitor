# Step-by-Step Vercel Deployment Guide

Follow these steps to deploy your Blood Pressure Monitor app to Vercel.

## Prerequisites

- ✅ Your code is pushed to GitHub
- ✅ You have a Vercel account (sign up at [vercel.com](https://vercel.com) if needed)

---

## Step 1: Push Your Code to GitHub

If you haven't already, commit and push your code:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

---

## Step 2: Create Vercel Project

### Option A: Via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign in or create an account

2. **Import Your Repository**
   - Click **"Add New..."** → **"Project"**
   - Click **"Import Git Repository"**
   - Select your GitHub repository (`bp-monitor`)
   - Click **"Import"**

3. **Configure Project Settings**
   - **Framework Preset**: Vite (should be auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)
   
   ✅ **Leave these as-is** - Vercel should auto-detect them correctly

4. **Click "Deploy"**
   - Wait for the build to complete (2-3 minutes)
   - Your app will be live, but the database won't work yet

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel

# For production deployment
vercel --prod
```

---

## Step 3: Set Up Blob Storage (Required for Data Persistence)

Your database needs persistent storage. Here's how to set it up:

1. **Go to Your Project in Vercel Dashboard**
   - Click on your project name

2. **Navigate to Storage Tab**
   - Click **"Storage"** in the left sidebar
   - Click **"Create Database"**

3. **Create Blob Storage**
   - Select **"Blob"** as the storage type
   - Name it: `bp-monitor-storage` (or any name you prefer)
   - Click **"Create"**

4. **Note the Token** (if shown)
   - Vercel usually auto-adds the token, but note it down just in case

---

## Step 4: Add Environment Variable

1. **Go to Project Settings**
   - In your Vercel project, click **"Settings"**
   - Click **"Environment Variables"** in the left sidebar

2. **Add BLOB_READ_WRITE_TOKEN**
   - **Name**: `BLOB_READ_WRITE_TOKEN`
   - **Value**: 
     - If you see it already listed (auto-added), you're good!
     - If not, go to Storage → Your Blob → Settings → Copy the token
   - **Environment**: Select all three:
     - ✅ Production
     - ✅ Preview  
     - ✅ Development
   - Click **"Save"**

---

## Step 5: Redeploy Your Application

After adding the environment variable, you need to redeploy:

1. **Go to Deployments Tab**
   - Click **"Deployments"** in your project
   - Click the **"..."** menu on the latest deployment
   - Click **"Redeploy"**
   - Or push a new commit to trigger a new deployment

2. **Wait for Deployment**
   - The build will take 2-3 minutes
   - Watch the build logs to ensure it completes successfully

---

## Step 6: Test Your Deployment

1. **Visit Your App**
   - Your app URL will be: `https://your-project-name.vercel.app`
   - Or check the deployment page for the URL

2. **Test the Features**
   - ✅ Add a new blood pressure reading
   - ✅ View the readings list
   - ✅ Edit an entry
   - ✅ Export to PDF
   - ✅ Refresh the page - data should persist!

---

## Troubleshooting

### Build Fails

**Check:**
- Build logs in Vercel Dashboard → Deployments → Click on failed deployment
- Ensure all dependencies are in `package.json`
- Try building locally: `npm run build`

**Common fixes:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### API Routes Return 500 Errors

**Check:**
- Function logs in Vercel Dashboard → Deployments → Functions tab
- Ensure `BLOB_READ_WRITE_TOKEN` is set correctly
- Verify Blob Storage is created

### Database Not Persisting

**Check:**
- Blob Storage is created in Storage tab
- `BLOB_READ_WRITE_TOKEN` environment variable is set
- Check function logs for sync errors
- Try adding a reading and checking if it persists after refresh

### CORS Errors

The API functions already include CORS headers, but if you see CORS errors:
- Check that API routes are being called correctly
- Verify the API base URL in your frontend code

---

## Quick Reference

**Your App URL:**
```
https://your-project-name.vercel.app
```

**API Endpoints:**
```
GET  https://your-project-name.vercel.app/api/readings
POST https://your-project-name.vercel.app/api/readings
PUT  https://your-project-name.vercel.app/api/readings/:id
```

**Environment Variables Needed:**
- `BLOB_READ_WRITE_TOKEN` (auto-added when you create Blob Storage)

---

## Next Steps After Deployment

1. **Custom Domain** (Optional)
   - Go to Settings → Domains
   - Add your custom domain

2. **Monitor Usage**
   - Check the Analytics tab for usage stats
   - Monitor function execution in the Functions tab

3. **Set Up Backups** (Recommended)
   - Consider exporting your database periodically
   - Or set up automated backups

---

## Local Development Still Works

Your local development setup is unchanged:

```bash
# Terminal 1: Backend
npm run dev:server

# Terminal 2: Frontend  
npm run dev
```

The Vercel serverless functions are only used in production. Local development uses your Express server.

---

## Need Help?

- Check Vercel logs: Dashboard → Your Project → Deployments → Click deployment → Functions/Logs
- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Check `DEPLOYMENT.md` for more detailed information

