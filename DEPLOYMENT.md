# Deployment Guide

## Common Deployment Issues & Solutions

### Issue: Slow Build Times (10-12 minutes)

**Root Cause:** Puppeteer downloads Chromium (~170MB) during `npm install`, which is very slow.

**Solutions:**

### Option 1: Skip Chromium Download (Recommended)

Set environment variable before install:
```bash
SKIP_PUPPETEER_DOWNLOAD=true npm install
```

Or use:
```bash
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true npm install
```

Chromium will download on first PDF generation instead.

### Option 2: Use System Chromium

Modify `server.js` to use system Chromium:
```javascript
const browser = await puppeteer.launch({
  executablePath: '/usr/bin/chromium-browser', // or system path
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});
```

## Platform-Specific Deployment

### Vercel

1. **Create `vercel.json`** (already included)
2. Set environment variable:
   ```
   SKIP_PUPPETEER_DOWNLOAD=true
   ```
3. Deploy:
   ```bash
   vercel --prod
   ```

**Note:** Vercel has a 50MB limit. Consider using Vercel's serverless functions with external Puppeteer service.

### Railway

1. **Create `railway.json`** (already included)
2. Set environment variable in Railway dashboard:
   ```
   SKIP_PUPPETEER_DOWNLOAD=true
   ```
3. Connect GitHub repo - Railway auto-deploys

### Render

1. **Create `render.yaml`** (already included)
2. Environment variables are set in the YAML
3. Connect GitHub repo - Render auto-deploys

### Heroku

1. Create `Procfile`:
   ```
   web: node server.js
   ```

2. Set buildpack:
   ```bash
   heroku buildpacks:add heroku/nodejs
   heroku buildpacks:add jontewks/puppeteer
   ```

3. Set config vars:
   ```bash
   heroku config:set SKIP_PUPPETEER_DOWNLOAD=true
   ```

4. Deploy:
   ```bash
   git push heroku main
   ```

### DigitalOcean App Platform

1. Set environment variables:
   ```
   SKIP_PUPPETEER_DOWNLOAD=true
   ```

2. Build command:
   ```bash
   npm install && SKIP_PUPPETEER_DOWNLOAD=true npm install
   ```

3. Run command:
   ```bash
   node server.js
   ```

## Optimized package.json Script

The `postinstall` script will skip Chromium download if `SKIP_PUPPETEER_DOWNLOAD=true`:

```json
"postinstall": "node -e \"if (process.env.SKIP_PUPPETEER_DOWNLOAD !== 'true') { require('puppeteer/install') }\""
```

## Alternative: Use Puppeteer-Core

For even faster builds, consider using `puppeteer-core` instead:

1. Install:
   ```bash
   npm install puppeteer-core
   ```

2. Modify `server.js`:
   ```javascript
   const puppeteer = require('puppeteer-core');
   
   const browser = await puppeteer.launch({
     executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium-browser',
     args: ['--no-sandbox', '--disable-setuid-sandbox']
   });
   ```

3. Install Chromium separately on the server.

## Build Time Optimization Summary

| Method | Build Time | First PDF Time |
|--------|-----------|----------------|
| Default (download Chromium) | 10-12 min | Instant |
| Skip download | 1-2 min | 30-60 sec |
| puppeteer-core + system | 1-2 min | Instant |

## Troubleshooting

### Build Still Slow?

1. Check if Chromium is being downloaded:
   ```bash
   npm install --verbose 2>&1 | grep -i chromium
   ```

2. Verify environment variable:
   ```bash
   echo $SKIP_PUPPETEER_DOWNLOAD
   ```

3. Clear npm cache:
   ```bash
   npm cache clean --force
   ```

### Chromium Not Found Error

If you skipped download, ensure Chromium is available:
- Use system Chromium
- Or let Puppeteer download on first use
- Or use a Puppeteer-as-a-Service

## Recommended Approach

For most platforms, use:
1. Set `SKIP_PUPPETEER_DOWNLOAD=true`
2. Let Puppeteer download Chromium on first PDF generation
3. Cache the Chromium binary if possible

This gives you:
- ✅ Fast builds (1-2 minutes)
- ✅ Automatic Chromium management
- ✅ Works on all platforms

