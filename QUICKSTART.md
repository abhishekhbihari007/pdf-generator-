# Quick Start Guide

## 1. Install Dependencies
```bash
npm install
```

## 2. Seed Database (Optional)
This creates a sample worksheet matching your reference image:
```bash
npm run seed
```

## 3. Start Server
```bash
npm start
# or for development:
npm run dev
```

## 4. Open Browser
Navigate to: http://localhost:3000

## 5. Generate Your First PDF

### Option A: Use Seeded Data
1. You'll see "Unit 4: Narrative Elements" in the list
2. Click "Download PDF" to generate the PDF
3. Or click "Preview" to see it in browser first

### Option B: Create New Worksheet
1. Click "Create New Worksheet"
2. Fill in the form:
   - Title: "My First Worksheet"
   - School Name: "聖公會基顯小學"
   - Class: "1B"
   - Worksheet ID: "3a"
3. In HTML Content, paste:
```html
<div class="section">
  <div class="section-title">4 記敍四要素</div>
  <div class="learning-focus">
    <h3>學習重點</h3>
    <ul>
      <li>注意:記敘四要素不一定會全部出現於同一個句子內。</li>
    </ul>
  </div>
</div>

<div class="section">
  <div class="section-title">III. 句子辨析</div>
  <div class="question">
    <div class="question-number">1. 今天,哥哥到日本旅行了。</div>
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
  </div>
</div>
```
4. Click "Save Worksheet"
5. Click "Download PDF"

## Key CSS Classes

- `.learning-focus` - Grey highlight box
- `.exercise-grid` - 2x2 grid layout
- `.fill-in-blank` - Underlined answer field
- `.section-title` - Section heading
- `.question-number` - Question number styling

## Troubleshooting

**Port 3000 in use?** Set `PORT=5000` in `.env` file

**Puppeteer errors?** Make sure Chromium downloaded correctly during `npm install`

**Chinese characters not showing?** Check browser console - Google Fonts should load automatically

## Next Steps

- Customize the template in `views/layout.ejs`
- Add your own HTML content
- Modify styles to match your brand
- Integrate with your data source

