const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pdfService = require('./services/pdfService');
const dbService = require('./services/dbService');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'PDF Generation Service is running' });
});

// Generate PDF from data
app.post('/api/generate-pdf', async (req, res) => {
  try {
    const { templateData, options } = req.body;
    
    if (!templateData) {
      return res.status(400).json({ error: 'Template data is required' });
    }

    const pdfBuffer = await pdfService.generatePDF(templateData, options);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=worksheet.pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate PDF', details: error.message });
  }
});

// Fetch data from database
app.post('/api/fetch-data', async (req, res) => {
  try {
    const { query, params } = req.body;
    const data = await dbService.fetchData(query, params);
    res.json({ success: true, data });
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ error: 'Failed to fetch data', details: error.message });
  }
});

// Get available templates
app.get('/api/templates', (req, res) => {
  res.json({
    templates: [
      {
        id: 'worksheet-4elements',
        name: 'Four Elements of Narration Worksheet',
        description: 'Chinese language worksheet for practicing sentence structure'
      }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

