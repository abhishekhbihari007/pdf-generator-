const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

class PDFService {
  constructor() {
    this.defaultOptions = {
      format: 'A4',
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      },
      printBackground: true,
      preferCSSPageSize: true
    };
  }

  /**
   * Generate PDF from template data
   * @param {Object} templateData - Data to populate the template
   * @param {Object} options - PDF generation options
   */
  async generatePDF(templateData, options = {}) {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const page = await browser.newPage();
      
      // Generate HTML from template
      const html = this.generateHTML(templateData);
      
      await page.setContent(html, { waitUntil: 'networkidle0' });
      
      // Merge default options with custom options
      const pdfOptions = {
        ...this.defaultOptions,
        ...options
      };

      const pdfBuffer = await page.pdf(pdfOptions);
      return pdfBuffer;
    } finally {
      await browser.close();
    }
  }

  /**
   * Generate HTML template matching the sample layout
   */
  generateHTML(data) {
    const {
      schoolName = '聖公會基顯小學',
      className = '1B',
      worksheetId = '3a',
      date = '',
      score = '',
      sections = []
    } = data;

    return `
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Worksheet PDF</title>
  <style>
    @page {
      size: A4;
      margin: 0;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Microsoft JhengHei', '微軟正黑體', 'SimHei', '黑體', Arial, sans-serif;
      font-size: 14pt;
      line-height: 1.6;
      color: #000;
      background: #fff;
      padding: 20mm 15mm;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 15px;
      border-bottom: 1px solid #000;
      padding-bottom: 10px;
    }
    
    .header-left {
      flex: 1;
    }
    
    .header-title {
      font-size: 16pt;
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .header-meta {
      font-size: 12pt;
      margin-top: 8px;
    }
    
    .header-right {
      text-align: right;
    }
    
    .section {
      margin-bottom: 25px;
      page-break-inside: avoid;
    }
    
    .section-title {
      font-size: 15pt;
      font-weight: bold;
      margin-bottom: 10px;
      margin-top: 15px;
    }
    
    .learning-points {
      background: #f5f5f5;
      padding: 10px;
      margin-bottom: 15px;
      border-left: 3px solid #000;
    }
    
    .learning-points ul {
      margin-left: 20px;
      margin-top: 5px;
    }
    
    .example {
      margin-top: 8px;
      font-style: italic;
      color: #333;
    }
    
    .question {
      margin-bottom: 20px;
      page-break-inside: avoid;
    }
    
    .question-number {
      font-weight: bold;
      margin-bottom: 8px;
    }
    
    .question-text {
      margin-bottom: 10px;
    }
    
    .answer-lines {
      margin-left: 20px;
      margin-top: 8px;
    }
    
    .answer-line {
      margin-bottom: 5px;
      display: flex;
      align-items: baseline;
    }
    
    .answer-label {
      min-width: 40px;
      font-weight: bold;
    }
    
    .answer-field {
      border-bottom: 1px solid #000;
      min-width: 200px;
      margin-left: 10px;
      padding-bottom: 2px;
    }
    
    .image-container {
      margin: 15px 0;
      text-align: center;
      page-break-inside: avoid;
    }
    
    .image-container img {
      max-width: 100%;
      height: auto;
      border: 1px solid #ddd;
    }
    
    .hint-structure {
      margin: 10px 0;
      padding: 10px;
      background: #f9f9f9;
      border: 1px dashed #999;
    }
    
    .hint-item {
      margin: 5px 0;
    }
    
    .complete-sentence {
      margin-top: 10px;
      font-weight: bold;
      color: #000;
      padding: 8px;
      background: #fff;
      border: 1px solid #000;
    }
    
    .footer {
      margin-top: 30px;
      padding-top: 15px;
      border-top: 1px solid #000;
      font-size: 10pt;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    
    .footer-left {
      text-align: left;
    }
    
    .footer-right {
      text-align: right;
      font-size: 9pt;
    }
    
    .page-number {
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .copyright {
      font-size: 8pt;
      color: #666;
      margin-top: 5px;
    }
    
    @media print {
      body {
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <!-- Header -->
  <div class="header">
    <div class="header-left">
      <div class="header-title">${schoolName}_${className}_${worksheetId}</div>
      <div class="header-meta">
        日期 ______${date ? ` ${date}` : ''}______  成績 ______${score ? ` ${score}` : ''}______
      </div>
    </div>
    <div class="header-right">
      完成 ▼
    </div>
  </div>

  ${this.renderSections(sections)}

  <!-- Footer -->
  <div class="footer">
    <div class="footer-left">
      <div class="page-number">6</div>
      <div class="copyright">
        新領域 版權所有 不得翻印<br>
        大雅圖書出版有限公司版權印記
      </div>
    </div>
    <div class="footer-right">
      ISBN 978-988-8149-59-9<br>
      © 新領域
    </div>
  </div>
</body>
</html>
    `;
  }

  /**
   * Render sections based on data
   */
  renderSections(sections) {
    if (!sections || sections.length === 0) {
      return this.getDefaultSections();
    }

    return sections.map(section => {
      switch (section.type) {
        case 'learning-points':
          return this.renderLearningPoints(section);
        case 'sentence-analysis':
          return this.renderSentenceAnalysis(section);
        case 'picture-completion':
          return this.renderPictureCompletion(section);
        default:
          return '';
      }
    }).join('');
  }

  /**
   * Render learning points section
   */
  renderLearningPoints(section) {
    const { title, points, example } = section;
    return `
      <div class="section">
        <div class="section-title">${title || '4 記敍四要素'}</div>
        <div class="learning-points">
          <ul>
            ${(points || []).map(point => `<li>${point}</li>`).join('')}
          </ul>
          ${example ? `<div class="example">${example}</div>` : ''}
        </div>
      </div>
    `;
  }

  /**
   * Render sentence analysis section
   */
  renderSentenceAnalysis(section) {
    const { title, instructions, questions } = section;
    return `
      <div class="section">
        <div class="section-title">${title || 'III. 句子辨析'}</div>
        <div class="question-text">${instructions || ''}</div>
        ${(questions || []).map((q, idx) => `
          <div class="question">
            <div class="question-number">${idx + 1}. ${q.sentence}</div>
            <div class="answer-lines">
              <div class="answer-line">
                <span class="answer-label">a. 時</span>
                <span class="answer-field">${q.answers?.time || ''}</span>
              </div>
              <div class="answer-line">
                <span class="answer-label">b. 地</span>
                <span class="answer-field">${q.answers?.place || ''}</span>
              </div>
              <div class="answer-line">
                <span class="answer-label">c. 人</span>
                <span class="answer-field">${q.answers?.person || ''}</span>
              </div>
              <div class="answer-line">
                <span class="answer-label">d. 事</span>
                <span class="answer-field">${q.answers?.event || ''}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  /**
   * Render picture completion section
   */
  renderPictureCompletion(section) {
    const { title, instructions, questions } = section;
    return `
      <div class="section">
        <div class="section-title">${title || 'IV. 看圖完句'}</div>
        <div class="question-text">${instructions || ''}</div>
        ${(questions || []).map((q, idx) => `
          <div class="question">
            <div class="question-number">${idx + 1}.</div>
            ${q.image ? `
              <div class="image-container">
                <img src="${q.image}" alt="Question ${idx + 1} image" />
              </div>
            ` : ''}
            ${q.hints ? `
              <div class="hint-structure">
                ${Object.entries(q.hints).map(([key, value]) => `
                  <div class="hint-item">${value} (${key})</div>
                `).join('')}
              </div>
            ` : ''}
            ${q.completeSentence ? `
              <div class="complete-sentence">${q.completeSentence}</div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  /**
   * Get default sections matching the sample
   */
  getDefaultSections() {
    return `
      <div class="section">
        <div class="section-title">4 記敍四要素</div>
        <div class="learning-points">
          <ul>
            <li>注意:記敘四要素不一定會全部出現於同一個句子內。</li>
          </ul>
          <div class="example">
            例子:今天,我吃了一件蛋糕。(句子中只有時間、人物和事情,並沒有地點。)
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">III. 句子辨析</div>
        <div class="question-text">
          根據下列各句,在橫線上填上適當的記敍四要素,沒有提及的填×。
        </div>
        <div class="question">
          <div class="question-number">1. 今天,哥哥到日本旅行了。</div>
          <div class="answer-lines">
            <div class="answer-line">
              <span class="answer-label">a. 時</span>
              <span class="answer-field">今天</span>
            </div>
            <div class="answer-line">
              <span class="answer-label">b. 地</span>
              <span class="answer-field">日本</span>
            </div>
            <div class="answer-line">
              <span class="answer-label">c. 人</span>
              <span class="answer-field">哥哥</span>
            </div>
            <div class="answer-line">
              <span class="answer-label">d. 事</span>
              <span class="answer-field">旅行</span>
            </div>
          </div>
        </div>
        <div class="question">
          <div class="question-number">2. 星期日,我和爸爸媽媽踏自行車。</div>
          <div class="answer-lines">
            <div class="answer-line">
              <span class="answer-label">a. 時</span>
              <span class="answer-field">星期日</span>
            </div>
            <div class="answer-line">
              <span class="answer-label">b. 地</span>
              <span class="answer-field">×</span>
            </div>
            <div class="answer-line">
              <span class="answer-label">c. 人</span>
              <span class="answer-field">我和爸爸媽媽</span>
            </div>
            <div class="answer-line">
              <span class="answer-label">d. 事</span>
              <span class="answer-field">踏自行車</span>
            </div>
          </div>
        </div>
        <div class="question">
          <div class="question-number">3. 昨天,我在家裏看了一本書。</div>
          <div class="answer-lines">
            <div class="answer-line">
              <span class="answer-label">a. 時</span>
              <span class="answer-field">昨天</span>
            </div>
            <div class="answer-line">
              <span class="answer-label">b. 地</span>
              <span class="answer-field">家裏</span>
            </div>
            <div class="answer-line">
              <span class="answer-label">c. 人</span>
              <span class="answer-field">我</span>
            </div>
            <div class="answer-line">
              <span class="answer-label">d. 事</span>
              <span class="answer-field">看了一本書</span>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">IV. 看圖完句</div>
        <div class="question-text">
          根據圖意和括號內的提示,寫作句子。(答案只供參考)
        </div>
        <div class="question">
          <div class="question-number">1.</div>
          <div class="hint-structure">
            <div class="hint-item">今天 (時間)</div>
            <div class="hint-item">我和家人 (人物)</div>
            <div class="hint-item">到郊野公園 (地點)</div>
            <div class="hint-item">燒烤 (事情)</div>
          </div>
          <div class="complete-sentence">今天,我和家人到郊野公園燒烤。</div>
        </div>
        <div class="question">
          <div class="question-number">2.</div>
          <div class="hint-structure">
            <div class="hint-item">晚上 (時間)</div>
            <div class="hint-item">我和小思 (人物)</div>
            <div class="hint-item">到海旁 (地點)</div>
            <div class="hint-item">觀賞煙花 (事情)</div>
          </div>
          <div class="complete-sentence">晚上,我和小思到海旁觀賞煙花。</div>
        </div>
      </div>
    `;
  }
}

module.exports = new PDFService();

