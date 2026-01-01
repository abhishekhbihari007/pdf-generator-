# 🚀 Quick Fix for Slow Deployment (10-12 minutes)

## The Problem
Puppeteer downloads Chromium (~170MB) during `npm install`, causing 10-12 minute build times.

## ⚡ Quick Solution

### For Vercel (Numeric Value Required)

**Set this environment variable in your deployment platform:**

- **Key:** `SKIP_PUPPETEER_DOWNLOAD`
- **Value:** `1` (numeric, not "true")

**Important:** Vercel requires numeric values for environment variables, so use `1` instead of `true`.

This will:
- ✅ Reduce build time from 10-12 min → **1-2 minutes**
- ✅ Chromium downloads on first PDF generation instead
- ✅ Works automatically

### For Other Platforms (Railway, Render, etc.)

You can use either:
- `SKIP_PUPPETEER_DOWNLOAD=1` (numeric)
- `SKIP_PUPPETEER_DOWNLOAD=true` (string)

### How to Set Environment Variable

#### Vercel
1. Go to Project Settings → Environment Variables
2. Add: `SKIP_PUPPETEER_DOWNLOAD` = `1` (numeric value)
3. Redeploy

#### Railway
1. Go to Variables tab
2. Add: `SKIP_PUPPETEER_DOWNLOAD` = `1` or `true`
3. Redeploy

#### Render
1. Go to Environment tab
2. Add: `SKIP_PUPPETEER_DOWNLOAD` = `1` or `true`
3. Redeploy

#### Heroku
```bash
heroku config:set SKIP_PUPPETEER_DOWNLOAD=1
```

#### DigitalOcean
1. Go to App Settings → App-Level Environment Variables
2. Add: `SKIP_PUPPETEER_DOWNLOAD` = `1`
3. Redeploy

## Alternative: Update package.json Build Command

If you can't set environment variables, update your build command to:

```bash
SKIP_PUPPETEER_DOWNLOAD=1 npm install
```

## Verify It's Working

After deployment, check build logs:
- ❌ **Before:** "Downloading Chromium..." (takes 10+ min)
- ✅ **After:** No Chromium download message (builds in 1-2 min)

## First PDF Generation

The first PDF generation after deployment will take 30-60 seconds (Chromium downloads then). Subsequent PDFs will be instant.

## Still Having Issues?

1. Check deployment logs for Chromium download messages
2. Verify environment variable is set correctly (use `1` for Vercel)
3. Try clearing build cache and redeploying
4. See `DEPLOYMENT.md` for platform-specific details
