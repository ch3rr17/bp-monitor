# How to Find Your Vercel Blob Storage Token

## Quick Steps to Find the Token

### Option 1: From the Storage Overview Page

1. **Go to Storage Tab**
   - You should already be on the Storage tab (you can see it in the navigation)

2. **Click on Your Blob Storage**
   - Look for your Blob Storage in the list (it might be named something like `store_4qli8TFKghDNAHS5` or `bp-monitor-storage`)
   - **Click on the Blob Storage name** (not the "Getting Started" link)

3. **Go to Settings Tab**
   - Once you're inside the Blob Storage, look for tabs at the top:
     - **Overview** (you might be here)
     - **Settings** ← Click this one!
     - **Files** (if available)

4. **Find the Token**
   - In the Settings tab, look for:
     - **"Token"** or **"Access Token"** or **"BLOB_READ_WRITE_TOKEN"**
     - It will look like: `vercel_blob_rw_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - **Copy this token** - you'll need it for the environment variable

---

### Option 2: From the Overview Page

1. **If you're on the Overview/Getting Started page:**
   - Look for a section that says **"Environment Variables"** or **"Token"**
   - Sometimes Vercel shows it here
   - If you see `BLOB_READ_WRITE_TOKEN` listed, that's it!

2. **Check the Left Sidebar**
   - In the left sidebar, you might see:
     - **"Settings"** - Click this to find the token
     - **"Environment Variables"** - The token might be listed here

---

### Option 3: From Project Settings (Alternative)

If you can't find it in the Blob Storage settings:

1. **Go to Project Settings**
   - Click **"Settings"** in the top navigation (next to Storage, Deployments, etc.)

2. **Go to Environment Variables**
   - Click **"Environment Variables"** in the left sidebar
   - Look for `BLOB_READ_WRITE_TOKEN`
   - If it's already there, you're good! Just copy it
   - If it's not there, you'll need to add it (see below)

---

## If You Still Can't Find It

### Check if Vercel Auto-Added It

1. **Go to Project Settings → Environment Variables**
   - Sometimes Vercel automatically adds the token when you create Blob Storage
   - Look for `BLOB_READ_WRITE_TOKEN` in the list
   - If it's there, you can use that value

### Generate a New Token (If Needed)

1. **Go to Your Blob Storage**
   - Storage tab → Click on your Blob Storage

2. **Settings Tab**
   - Click **"Settings"** tab
   - Look for **"Tokens"** or **"Access Tokens"** section
   - Click **"Create Token"** or **"Generate Token"** if available
   - Copy the new token

---

## Visual Guide: Where to Click

```
Vercel Dashboard
├── Your Project (bp-monitor)
    ├── Storage Tab ← You're here
        ├── Your Blob Storage (click on the name) ← Click this!
            ├── Overview Tab
            ├── Settings Tab ← Go here to find token
            └── Files Tab
```

---

## What the Token Looks Like

The token will look something like:
```
vercel_blob_rw_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Or it might be shorter:
```
vercel_blob_xxxxxxxxxxxxxxxx
```

---

## Once You Have the Token

1. **Copy the token**

2. **Go to Project Settings → Environment Variables**
   - Add new variable:
     - **Key**: `BLOB_READ_WRITE_TOKEN`
     - **Value**: Paste your token
     - **Environments**: Select all (Production, Preview, Development)

3. **Redeploy your app**

---

## Still Having Trouble?

If you can't find the token anywhere:

1. **Check if it's already set as an environment variable:**
   - Settings → Environment Variables
   - Look for `BLOB_READ_WRITE_TOKEN`

2. **Try creating a new Blob Storage:**
   - Delete the current one (if empty)
   - Create a new Blob Storage
   - Vercel might show the token during creation

3. **Check Vercel Documentation:**
   - The token might be auto-generated and you need to check the Blob Storage settings page more carefully

Let me know if you still can't find it and I can help troubleshoot further!

