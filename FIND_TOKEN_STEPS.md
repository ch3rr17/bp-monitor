# How to Find Your Blob Storage Token

## The Token is Likely Auto-Managed by Vercel

When you connect a Blob Store to your project, Vercel automatically creates the environment variable. You need to check your **Project Settings**, not the Blob Storage settings.

## Step-by-Step Instructions

### Step 1: Go to Project Settings (NOT Blob Storage Settings)

1. **Click "Settings" in the TOP navigation bar**
   - This is in the main Vercel navigation (next to Storage, Deployments, Analytics, etc.)
   - NOT the "Settings" in the left sidebar of the Blob Storage page

2. **Look for "Environment Variables" in the LEFT sidebar**
   - You should see a list like:
     - General
     - Environment Variables ← **Click this!**
     - Git
     - Domains
     - etc.

### Step 2: Find BLOB_READ_WRITE_TOKEN

1. **Click "Environment Variables"**
2. **Look for `BLOB_READ_WRITE_TOKEN` in the list**
   - It should be there if you connected the Blob Store
   - The value might be hidden (showing as dots or asterisks)

3. **To view the token value:**
   - Click on the row with `BLOB_READ_WRITE_TOKEN`
   - Or click an "eye" icon to reveal it
   - Or click "Edit" to see the value

### Step 3: If It's Not There

If `BLOB_READ_WRITE_TOKEN` is NOT in the Environment Variables list:

1. **Go back to Storage → Your Blob Store**
2. **Click "Projects" in the left sidebar** (under Browser)
3. **Check if your project is listed and connected**
4. **If not connected, click "Connect Project" and connect it**

---

## Alternative: Check via Vercel CLI

If you can't find it in the UI, we can try the CLI approach, but first we need to link your project.

---

## Quick Navigation Path

```
Vercel Dashboard
└── Your Project (bp-monitor)
    └── Settings (TOP nav) ← Click this!
        └── Environment Variables (LEFT sidebar) ← Click this!
            └── Look for BLOB_READ_WRITE_TOKEN
```

---

## What to Do Next

1. **Click "Settings" in the TOP navigation** (not the Blob Storage sidebar)
2. **Click "Environment Variables" in the LEFT sidebar**
3. **Look for `BLOB_READ_WRITE_TOKEN`**
4. **Tell me what you see!**

If it's there but hidden, we can reveal it. If it's not there, we'll need to reconnect the Blob Store to your project.





