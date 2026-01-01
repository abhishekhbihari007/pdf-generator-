const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const path = require('path');
const db = require('./database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

// Initialize database
db.initialize().catch(err => {
  console.error('Database initialization failed:', err);
  process.exit(1);
});

// Routes

/**
 * GET / - List all worksheets
 */
app.get('/', async (req, res) => {
  try {
    const worksheets = await db.getAllWorksheets();
    res.render('index', { worksheets });
  } catch (error) {
    console.error('Error fetching worksheets:', error);
    res.status(500).send('Error fetching worksheets: ' + error.message);
  }
});

/**
 * GET /create - Show worksheet editor
 */
app.get('/create', (req, res) => {
  res.render('create', { worksheet: null });
});

/**
 * GET /edit/:id - Edit existing worksheet
 */
app.get('/edit/:id', async (req, res) => {
  try {
    const worksheet = await db.getWorksheetById(req.params.id);
    if (!worksheet) {
      return res.status(404).send('Worksheet not found');
    }
    
    // Parse header_info if it's a string
    let headerInfo = worksheet.header_info;
    if (typeof headerInfo === 'string') {
      try {
        headerInfo = JSON.parse(headerInfo);
      } catch (e) {
        // If parsing fails, use as is
      }
    }
    
    res.render('create', { 
      worksheet: {
        ...worksheet,
        header_info: headerInfo
      }
    });
  } catch (error) {
    console.error('Error fetching worksheet:', error);
    res.status(500).send('Error fetching worksheet: ' + error.message);
  }
});

/**
 * POST /save - Save worksheet (create or update)
 */
app.post('/save', async (req, res) => {
  try {
    const { id, title, header_info, html_content } = req.body;
    
    if (!title || !html_content) {
      return res.status(400).json({ error: 'Title and HTML content are required' });
    }

    let result;
    if (id) {
      // Update existing
      result = await db.updateWorksheet(id, title, header_info, html_content);
    } else {
      // Create new
      result = await db.createWorksheet(title, header_info, html_content);
    }

    res.json({ success: true, worksheet: result });
  } catch (error) {
    console.error('Error saving worksheet:', error);
    res.status(500).json({ error: 'Error saving worksheet: ' + error.message });
  }
});

/**
 * GET /pdf/:id - Generate PDF from worksheet
 */
app.get('/pdf/:id', async (req, res) => {
  let browser = null;
  
  try {
    const worksheet = await db.getWorksheetById(req.params.id);
    if (!worksheet) {
      return res.status(404).send('Worksheet not found');
    }

    // Parse header_info
    let headerInfo = worksheet.header_info;
    if (typeof headerInfo === 'string') {
      try {
        headerInfo = JSON.parse(headerInfo);
      } catch (e) {
        headerInfo = {};
      }
    }

    // Launch Puppeteer with optimized settings
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process'
      ]
    });

    const page = await browser.newPage();

    // Render the EJS template with worksheet data
    const html = await new Promise((resolve, reject) => {
      app.render('layout', {
        headerInfo: headerInfo,
        htmlContent: worksheet.html_content,
        title: worksheet.title
      }, (err, html) => {
        if (err) reject(err);
        else resolve(html);
      });
    });

    // Set content and wait for resources
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Wait for fonts to load
    await page.evaluate(() => {
      return document.fonts.ready;
    });

    // Wait for Paged.js to render
    await page.waitForSelector('.pagedjs_pages', { timeout: 10000 }).catch(() => {
      console.warn('Paged.js pages not found, proceeding anyway...');
    });

    // Additional wait to ensure Paged.js has finished rendering
    await page.waitForTimeout(1000);

    // Generate PDF with A4 settings
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      },
      printBackground: true,
      preferCSSPageSize: true
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${worksheet.title || 'worksheet'}.pdf"`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('PDF Generation Error:', error);
    res.status(500).send('Error generating PDF: ' + error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

/**
 * GET /preview/:id - Preview worksheet in browser
 */
app.get('/preview/:id', async (req, res) => {
  try {
    const worksheet = await db.getWorksheetById(req.params.id);
    if (!worksheet) {
      return res.status(404).send('Worksheet not found');
    }

    let headerInfo = worksheet.header_info;
    if (typeof headerInfo === 'string') {
      try {
        headerInfo = JSON.parse(headerInfo);
      } catch (e) {
        headerInfo = {};
      }
    }

    res.render('layout', {
      headerInfo: headerInfo,
      htmlContent: worksheet.html_content,
      title: worksheet.title
    });
  } catch (error) {
    console.error('Error previewing worksheet:', error);
    res.status(500).send('Error previewing worksheet: ' + error.message);
  }
});

/**
 * DELETE /delete/:id - Delete worksheet
 */
app.delete('/delete/:id', async (req, res) => {
  try {
    const result = await db.deleteWorksheet(req.params.id);
    res.json({ success: result.deleted });
  } catch (error) {
    console.error('Error deleting worksheet:', error);
    res.status(500).json({ error: 'Error deleting worksheet: ' + error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Worksheet Generator running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down...');
  await db.close();
  process.exit(0);
});

