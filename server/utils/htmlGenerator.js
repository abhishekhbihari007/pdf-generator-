/**
 * Generate HTML content from structured form data
 */
class HTMLGenerator {
  /**
   * Generate HTML from worksheet sections
   */
  static generateHTML(sections) {
    if (!sections || sections.length === 0) {
      return '<p>No content added yet.</p>';
    }

    let html = '';
    
    sections.forEach(section => {
      switch (section.type) {
        case 'learning-focus':
          html += this.generateLearningFocus(section);
          break;
        case 'sentence-analysis':
          html += this.generateSentenceAnalysis(section);
          break;
        case 'picture-completion':
          html += this.generatePictureCompletion(section);
          break;
        case 'custom':
          html += this.generateCustomSection(section);
          break;
      }
    });

    return html;
  }

  /**
   * Generate Learning Focus section
   */
  static generateLearningFocus(section) {
    const { title, points, example } = section;
    
    let pointsHTML = '';
    if (points && points.length > 0) {
      pointsHTML = '<ul>';
      points.forEach(point => {
        if (point.trim()) {
          pointsHTML += `<li>${this.escapeHtml(point)}</li>`;
        }
      });
      pointsHTML += '</ul>';
    }

    const exampleHTML = example ? `<div class="example">${this.escapeHtml(example)}</div>` : '';

    return `
      <div class="section">
        <div class="section-title">${this.escapeHtml(title || '學習重點')}</div>
        <div class="learning-focus">
          <h3>學習重點</h3>
          ${pointsHTML}
          ${exampleHTML}
        </div>
      </div>
    `;
  }

  /**
   * Generate Sentence Analysis section
   */
  static generateSentenceAnalysis(section) {
    const { title, instructions, questions } = section;
    
    let questionsHTML = '';
    if (questions && questions.length > 0) {
      questions.forEach((question, index) => {
        questionsHTML += this.generateQuestion(question, index + 1);
      });
    }

    return `
      <div class="section">
        <div class="section-title">${this.escapeHtml(title || '句子辨析')}</div>
        ${instructions ? `<div class="question-text">${this.escapeHtml(instructions)}</div>` : ''}
        ${questionsHTML}
      </div>
    `;
  }

  /**
   * Generate a single question with exercise grid
   */
  static generateQuestion(question, number) {
    const { sentence, answers } = question;
    const { time = '', place = '', person = '', event = '' } = answers || {};

    return `
      <div class="question">
        <div class="question-number">${number}. ${this.escapeHtml(sentence || '')}</div>
        <div class="exercise-grid">
          <div class="exercise-grid-item">
            <span class="exercise-grid-label">a. 時</span>
            <span class="fill-in-blank">${this.escapeHtml(time)}</span>
          </div>
          <div class="exercise-grid-item">
            <span class="exercise-grid-label">b. 地</span>
            <span class="fill-in-blank">${this.escapeHtml(place)}</span>
          </div>
          <div class="exercise-grid-item">
            <span class="exercise-grid-label">c. 人</span>
            <span class="fill-in-blank">${this.escapeHtml(person)}</span>
          </div>
          <div class="exercise-grid-item">
            <span class="exercise-grid-label">d. 事</span>
            <span class="fill-in-blank">${this.escapeHtml(event)}</span>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Generate Picture Completion section
   */
  static generatePictureCompletion(section) {
    const { title, instructions, questions } = section;
    
    let questionsHTML = '';
    if (questions && questions.length > 0) {
      questions.forEach((question, index) => {
        questionsHTML += this.generatePictureQuestion(question, index + 1);
      });
    }

    return `
      <div class="section">
        <div class="section-title">${this.escapeHtml(title || '看圖完句')}</div>
        ${instructions ? `<div class="question-text">${this.escapeHtml(instructions)}</div>` : ''}
        ${questionsHTML}
      </div>
    `;
  }

  /**
   * Generate a picture completion question
   */
  static generatePictureQuestion(question, number) {
    const { hints, completeSentence } = question;
    
    let hintsHTML = '';
    if (hints) {
      hintsHTML = '<div class="hint-structure">';
      if (hints.time) hintsHTML += `<div class="hint-item">${this.escapeHtml(hints.time)} (時間)</div>`;
      if (hints.person) hintsHTML += `<div class="hint-item">${this.escapeHtml(hints.person)} (人物)</div>`;
      if (hints.place) hintsHTML += `<div class="hint-item">${this.escapeHtml(hints.place)} (地點)</div>`;
      if (hints.event) hintsHTML += `<div class="hint-item">${this.escapeHtml(hints.event)} (事情)</div>`;
      hintsHTML += '</div>';
    }

    const sentenceHTML = completeSentence 
      ? `<div class="complete-sentence">${this.escapeHtml(completeSentence)}</div>` 
      : '';

    return `
      <div class="question">
        <div class="question-number">${number}.</div>
        ${hintsHTML}
        ${sentenceHTML}
      </div>
    `;
  }

  /**
   * Generate custom section
   */
  static generateCustomSection(section) {
    const { title, content } = section;
    return `
      <div class="section">
        ${title ? `<div class="section-title">${this.escapeHtml(title)}</div>` : ''}
        <div class="question-text">${this.escapeHtml(content || '')}</div>
      </div>
    `;
  }

  /**
   * Escape HTML to prevent XSS
   */
  static escapeHtml(text) {
    if (!text) return '';
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }
}

module.exports = HTMLGenerator;

