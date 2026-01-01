# Worksheet Generator - Commercial A4 PDF System

A professional PDF generation system for creating educational worksheets with precise typography, accurate margins, and commercial print standards. Built with Node.js, Puppeteer, Paged.js, SQLite, and EJS.

## Features

- ✅ **A4 Format Compliance**: Generates PDFs with precise A4 dimensions using Paged.js
- ✅ **Chinese Font Support**: Google Fonts "Noto Sans TC" for perfect Traditional Chinese rendering
- ✅ **Professional Typography**: Accurate font rendering and spacing
- ✅ **SQLite Database**: Lightweight database for worksheet storage
- ✅ **EJS Templating**: Server-side rendering with clean template structure
- ✅ **Print-Ready Output**: Meets commercial print standards and pre-press requirements
- ✅ **Exercise Grid Component**: 2x2 grid layout for Time/Place/Person/Event exercises
- ✅ **Learning Focus Box**: Highlighted grey boxes for key learning points

## Tech Stack

### Backend
- **Node.js** with Express
- **Puppeteer** for PDF generation (HTML to PDF)
- **Paged.js** for A4 layout compliance and pagination
- **SQLite3** for database storage
- **EJS** for server-side templating

## Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Seed the database with sample data (optional):**
```bash
npm run seed
```

3. **Start the server:**
```bash
npm start
# or for development with auto-reload:
npm run dev
```

4. **Open your browser:**
```
http://localhost:3000
```

## Usage

### Routes

- **GET /** - List all worksheets
- **GET /create** - Create new worksheet (editor)
- **GET /edit/:id** - Edit existing worksheet
- **POST /save** - Save worksheet (create or update)
- **GET /pdf/:id** - Generate and download PDF
- **GET /preview/:id** - Preview worksheet in browser
- **DELETE /delete/:id** - Delete worksheet

### Creating a Worksheet

1. Navigate to `/create` or click "Create New Worksheet"
2. Fill in the title and header information
3. Enter HTML content using the provided CSS classes:
   - `.learning-focus` - Grey highlight box for learning points
   - `.exercise-grid` - 2x2 grid for Time/Place/Person/Event
   - `.fill-in-blank` - Underlined span for answers
4. Click "Save Worksheet"
5. Generate PDF by clicking "Download PDF"

### HTML Components

#### Learning Focus Box
```html
<div class="learning-focus">
  <h3>4 記敍四要素</h3>
  <ul>
    <li>注意:記敘四要素不一定會全部出現於同一個句子內。</li>
  </ul>
  <div class="example">
    例子:今天,我吃了一件蛋糕。(句子中只有時間、人物和事情,並沒有地點。)
  </div>
</div>
```

#### Exercise Grid (2x2)
```html
<div class="exercise-grid">
  <div class="exercise-grid-item">
    <span class="exercise-grid-label">a. 時</span>
    <span class="fill-in-blank">今天</span>
  </div>
  <div class="exercise-grid-item">
    <span class="exercise-grid-label">b. 地</span>
    <span class="fill-in-blank">日本</span>
  </div>
  <div class="exercise-grid-item">
    <span class="exercise-grid-label">c. 人</span>
    <span class="fill-in-blank">哥哥</span>
  </div>
  <div class="exercise-grid-item">
    <span class="exercise-grid-label">d. 事</span>
    <span class="fill-in-blank">旅行</span>
  </div>
</div>
```

#### Fill-in-Blank
```html
<span class="fill-in-blank">答案內容</span>
```

## Database Schema

The system uses SQLite with a single `worksheets` table:

```sql
CREATE TABLE worksheets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  header_info TEXT NOT NULL,  -- JSON string
  html_content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

The `header_info` field stores JSON with:
- `schoolName` - School name
- `className` - Class identifier
- `worksheetId` - Worksheet identifier
- `date` - Optional date
- `score` - Optional score field

## PDF Generation Process

The PDF generation route (`/pdf/:id`) follows this process:

1. **Fetch worksheet** from database
2. **Launch Puppeteer** browser instance
3. **Render EJS template** with worksheet data
4. **Load HTML** into Puppeteer page
5. **Wait for fonts** (`document.fonts.ready`)
6. **Wait for Paged.js** to render (`.pagedjs_pages` selector)
7. **Generate PDF** with A4 format and 20mm margins
8. **Return PDF** as download

## Key Features Explained

### Paged.js Integration
Paged.js is crucial for A4 layout compliance. It handles:
- Page breaks
- Margin calculations
- Print-specific CSS rendering
- Multi-page document flow

### Noto Sans TC Font
The Google Font "Noto Sans TC" is **critical** for Chinese character rendering. It's loaded via CDN in the template and ensures all Traditional Chinese characters display correctly in the PDF.

### Exercise Grid
The `.exercise-grid` class creates a responsive 2x2 grid perfect for the "Four Elements of Narration" exercises (Time, Place, Person, Event).

### Learning Focus Box
The `.learning-focus` class creates a highlighted grey box with rounded corners, perfect for emphasizing key learning points.

## Customization

### Adjusting Margins

Edit `server.js` in the PDF generation route:
```javascript
const pdfBuffer = await page.pdf({
  format: 'A4',
  margin: {
    top: '20mm',    // Adjust as needed
    right: '20mm',
    bottom: '20mm',
    left: '20mm'
  }
});
```

### Modifying Styles

Edit `views/layout.ejs` to customize:
- Font sizes
- Colors
- Spacing
- Component styles

### Adding New Components

1. Add CSS class in `views/layout.ejs`
2. Use the class in your HTML content
3. Test with preview before generating PDF

## Print Standards

The generated PDFs are configured for:
- ✅ A4 paper size (210mm × 297mm)
- ✅ 20mm margins on all sides
- ✅ High-resolution output
- ✅ Background graphics enabled
- ✅ Pre-press ready format
- ✅ Commercial print quality

## Troubleshooting

### Puppeteer Installation Issues
If Puppeteer fails to install, you may need to install Chromium dependencies:
- **Linux**: `sudo apt-get install -y chromium-browser`
- **macOS**: Usually works out of the box
- **Windows**: Should work automatically

### Chinese Characters Not Rendering
- Ensure "Noto Sans TC" font is loaded (check network tab)
- Verify the Google Fonts link is in `views/layout.ejs`
- Check that `document.fonts.ready` is being awaited

### Paged.js Not Rendering
- Check browser console for errors
- Ensure Paged.js CDN links are accessible
- Verify `.pagedjs_pages` selector exists after rendering

### Database Errors
- Ensure SQLite3 is installed: `npm install sqlite3`
- Check file permissions for `worksheets.db`
- Verify database initialization in `database.js`

## Development

### Project Structure
```
.
├── server.js          # Main Express server
├── database.js        # SQLite database operations
├── seed.js           # Database seeding script
├── views/            # EJS templates
│   ├── layout.ejs    # Main PDF template
│   ├── index.ejs     # Worksheet list page
│   └── create.ejs    # Worksheet editor
├── public/           # Static files
└── worksheets.db     # SQLite database (created automatically)
```

## License

ISC

## Support

For issues or questions, please check the code comments or create an issue in the repository.
