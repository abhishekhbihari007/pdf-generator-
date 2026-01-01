# Quick Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MySQL (optional, only if using database integration)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

Or use the convenience command:
```bash
npm run install-all
```

### 2. Configure Environment (Optional)

Create a `.env` file in the root directory:

```env
PORT=5000

# Database Configuration (Optional)
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database
```

**Note:** Database configuration is optional. The system works without it if you're providing data manually through the UI.

### 3. Start the Application

#### Development Mode (Recommended)
Runs both server and client:
```bash
npm run dev
```

This will start:
- Backend server on: http://localhost:5000
- Frontend React app on: http://localhost:3000

#### Separate Terminals
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend  
cd client
npm start
```

### 4. Generate Your First PDF

1. Open http://localhost:3000 in your browser
2. Fill in the form with worksheet information
3. Check "Use default sample content" to see the sample layout
4. Click "Generate PDF"
5. The PDF will download automatically

## Testing Without Database

The system works perfectly without database configuration. You can:
- Enter data manually in the form
- Use the default sample content
- Generate PDFs immediately

## Database Setup (Optional)

If you want to use database integration:

1. Create a MySQL database
2. Run the SQL schema from README.md
3. Configure `.env` with your database credentials
4. Use the "Fetch from Database" feature in the UI

## Troubleshooting

### Port Already in Use
If port 5000 or 3000 is in use, change it in `.env` or `client/package.json`

### Puppeteer Issues
Puppeteer downloads Chromium automatically. If it fails:
- Check your internet connection
- Ensure you have write permissions
- On Linux, you may need: `sudo apt-get install -y chromium-browser`

### Chinese Fonts Not Displaying
The system uses system fonts. Ensure your server has Chinese fonts installed:
- Windows: Usually pre-installed
- Linux: `sudo apt-get install fonts-wqy-zenhei`
- macOS: Usually pre-installed

## Next Steps

- Customize the PDF template in `server/services/pdfService.js`
- Add your own section types
- Integrate with your database schema
- Adjust margins and styling as needed

