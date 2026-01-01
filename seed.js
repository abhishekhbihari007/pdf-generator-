const db = require('./database');

async function seed() {
  try {
    console.log('Initializing database...');
    await db.initialize();
    
    console.log('Seeding sample worksheet...');
    
    const headerInfo = {
      schoolName: '聖公會基顯小學',
      className: '1B',
      worksheetId: '3a',
      date: '',
      score: ''
    };

    const htmlContent = `
      <div class="section">
        <div class="section-title">4 記敍四要素</div>
        <div class="learning-focus">
          <h3>學習重點</h3>
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

        <div class="question">
          <div class="question-number">2. 星期日,我和爸爸媽媽踏自行車。</div>
          <div class="exercise-grid">
            <div class="exercise-grid-item">
              <span class="exercise-grid-label">a. 時</span>
              <span class="fill-in-blank">星期日</span>
            </div>
            <div class="exercise-grid-item">
              <span class="exercise-grid-label">b. 地</span>
              <span class="fill-in-blank">×</span>
            </div>
            <div class="exercise-grid-item">
              <span class="exercise-grid-label">c. 人</span>
              <span class="fill-in-blank">我和爸爸媽媽</span>
            </div>
            <div class="exercise-grid-item">
              <span class="exercise-grid-label">d. 事</span>
              <span class="fill-in-blank">踏自行車</span>
            </div>
          </div>
        </div>

        <div class="question">
          <div class="question-number">3. 昨天,我在家裏看了一本書。</div>
          <div class="exercise-grid">
            <div class="exercise-grid-item">
              <span class="exercise-grid-label">a. 時</span>
              <span class="fill-in-blank">昨天</span>
            </div>
            <div class="exercise-grid-item">
              <span class="exercise-grid-label">b. 地</span>
              <span class="fill-in-blank">家裏</span>
            </div>
            <div class="exercise-grid-item">
              <span class="exercise-grid-label">c. 人</span>
              <span class="fill-in-blank">我</span>
            </div>
            <div class="exercise-grid-item">
              <span class="exercise-grid-label">d. 事</span>
              <span class="fill-in-blank">看了一本書</span>
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

    const result = await db.createWorksheet(
      'Unit 4: Narrative Elements (記敍四要素)',
      headerInfo,
      htmlContent
    );

    console.log('Sample worksheet created with ID:', result.id);
    console.log('Seed completed successfully!');
    
    await db.close();
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    await db.close();
    process.exit(1);
  }
}

seed();

