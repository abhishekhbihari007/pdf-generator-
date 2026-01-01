# Project Structure

## Core Files

### `server.js`
Main Express server with all routes:
- `GET /` - List worksheets
- `GET /create` - Create worksheet editor
- `GET /edit/:id` - Edit worksheet
- `POST /save` - Save worksheet
- `GET /pdf/:id` - Generate PDF (with Puppeteer + Paged.js)
- `GET /preview/:id` - Preview in browser
- `DELETE /delete/:id` - Delete worksheet

### `database.js`
SQLite database operations:
- `initialize()` - Create tables
- `getAllWorksheets()` - List all
- `getWorksheetById(id)` - Get one
- `createWorksheet()` - Create new
- `updateWorksheet()` - Update existing
- `deleteWorksheet()` - Delete

### `seed.js`
Database seeding script that creates a sample worksheet matching your reference image.

## Templates (EJS)

### `views/layout.ejs`
Main PDF template with:
- ✅ Google Fonts "Noto Sans TC" link (CRITICAL for Chinese)
- ✅ Paged.js CDN integration
- ✅ A4 page setup with `@page { size: A4; margin: 20mm; }`
- ✅ All CSS classes: `.learning-focus`, `.exercise-grid`, `.fill-in-blank`
- ✅ Header and footer structure

### `views/index.ejs`
Worksheet list page with actions (Preview, PDF, Edit, Delete)

### `views/create.ejs`
Worksheet editor form with:
- Title input
- Header info fields (school, class, ID, date, score)
- HTML content textarea
- HTML examples

## Key CSS Classes

### `.learning-focus`
Grey highlight box with rounded corners:
```css
background-color: #f5f5f5;
border-radius: 8px;
padding: 15px;
border-left: 4px solid #333;
```

### `.exercise-grid`
2x2 grid for Time/Place/Person/Event:
```css
display: grid;
grid-template-columns: 1fr 1fr;
gap: 15px;
```

### `.fill-in-blank`
Underlined answer field:
```css
border-bottom: 1.5px solid #000;
min-width: 150px;
```

## PDF Generation Flow

1. User clicks "Download PDF" → `GET /pdf/:id`
2. Server fetches worksheet from SQLite
3. Renders `layout.ejs` with worksheet data
4. Launches Puppeteer browser
5. Sets HTML content
6. **Waits for fonts** (`document.fonts.ready`)
7. **Waits for Paged.js** (`.pagedjs_pages` selector)
8. Generates PDF with A4 format
9. Returns PDF as download

## Database Schema

```sql
worksheets
├── id (INTEGER PRIMARY KEY)
├── title (TEXT)
├── header_info (TEXT - JSON string)
├── html_content (TEXT)
├── created_at (DATETIME)
└── updated_at (DATETIME)
```

## Static Files

`public/` directory for static assets (currently empty, can add CSS/JS/images here)

## Old Files (Can be ignored)

- `client/` - Old React frontend (not used)
- `server/` - Old server structure (not used)
- These won't interfere with the new system

