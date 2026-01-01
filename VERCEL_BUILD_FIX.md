# Vercel Build Taking Too Long - Fix Guide

## Issue
Build is taking 4-5+ minutes instead of 1-2 minutes.

## Root Cause
Environment variables in `vercel.json` are available at **runtime**, but may not be available during the **build phase** when `npm install` runs.

## Solution: Set Environment Variables in Vercel Dashboard

The environment variables need to be set in **Vercel Project Settings**, not just in `vercel.json`.

### Steps:

1. **Go to Vercel Dashboard**
   - Navigate to your project
   - Click **Settings** → **Environment Variables**

2. **Add Environment Variables** (for all environments: Production, Preview, Development):
   - **Key:** `SKIP_PUPPETEER_DOWNLOAD`
   - **Value:** `1`
   - Click **Save**

   - **Key:** `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD`
   - **Value:** `1`
   - Click **Save**

3. **Redeploy**
   - Go to **Deployments** tab
   - Click **Redeploy** on the latest deployment
   - Or push a new commit to trigger a new build

## Alternative: Use Build Command

If environment variables still don't work, modify the build command in Vercel:

1. Go to **Settings** → **General** → **Build & Development Settings**
2. Override the build command:
   ```
   SKIP_PUPPETEER_DOWNLOAD=1 PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1 npm install
   ```

## Verify It's Working

After redeploying, check the build logs:
- ✅ **Good:** "Installing dependencies..." completes in 1-2 minutes
- ❌ **Bad:** "Downloading Chromium..." appears (takes 10+ minutes)

## Expected Build Times

- **With fix:** 1-2 minutes (no Chromium download)
- **Without fix:** 10-12 minutes (Chromium downloads)

## Why This Happens

Vercel's build process:
1. Runs `npm install` (needs env vars here)
2. Runs build scripts
3. Deploys (env vars from vercel.json available here)

The `vercel.json` env vars are primarily for **runtime**, not **build time**.

## Quick Check

In your build logs, look for:
- "Downloading Chromium..." = Still downloading (bad)
- No Chromium messages = Skipped (good)

