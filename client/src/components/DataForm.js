import React, { useState } from 'react';
import './DataForm.css';
import PDFGenerator from './PDFGenerator';

const DataForm = ({ onGenerate, onFetchFromDB, isGenerating }) => {
  const [formData, setFormData] = useState({
    schoolName: '聖公會基顯小學',
    className: '1B',
    worksheetId: '3a',
    date: '',
    score: '',
    useDefault: true,
    worksheetIdFromDB: ''
  });

  const [sections, setSections] = useState([
    {
      type: 'learning-points',
      title: '4 記敍四要素',
      points: ['注意:記敘四要素不一定會全部出現於同一個句子內。'],
      example: '例子:今天,我吃了一件蛋糕。(句子中只有時間、人物和事情,並沒有地點。)'
    },
    {
      type: 'sentence-analysis',
      title: 'III. 句子辨析',
      instructions: '根據下列各句,在橫線上填上適當的記敍四要素,沒有提及的填×。',
      questions: [
        {
          sentence: '今天,哥哥到日本旅行了。',
          answers: { time: '今天', place: '日本', person: '哥哥', event: '旅行' }
        },
        {
          sentence: '星期日,我和爸爸媽媽踏自行車。',
          answers: { time: '星期日', place: '×', person: '我和爸爸媽媽', event: '踏自行車' }
        },
        {
          sentence: '昨天,我在家裏看了一本書。',
          answers: { time: '昨天', place: '家裏', person: '我', event: '看了一本書' }
        }
      ]
    },
    {
      type: 'picture-completion',
      title: 'IV. 看圖完句',
      instructions: '根據圖意和括號內的提示,寫作句子。(答案只供參考)',
      questions: [
        {
          hints: {
            '時間': '今天',
            '人物': '我和家人',
            '地點': '到郊野公園',
            '事情': '燒烤'
          },
          completeSentence: '今天,我和家人到郊野公園燒烤。'
        },
        {
          hints: {
            '時間': '晚上',
            '人物': '我和小思',
            '地點': '到海旁',
            '事情': '觀賞煙花'
          },
          completeSentence: '晚上,我和小思到海旁觀賞煙花。'
        }
      ]
    }
  ]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFetchFromDB = async () => {
    if (!formData.worksheetIdFromDB) {
      alert('Please enter a worksheet ID');
      return;
    }

    const dbData = await onFetchFromDB(formData.worksheetIdFromDB);
    if (dbData) {
      // Transform and set the data
      setFormData(prev => ({
        ...prev,
        schoolName: dbData.school_name || prev.schoolName,
        className: dbData.class_name || prev.className,
        worksheetId: dbData.worksheet_id || prev.worksheetId,
        date: dbData.date || prev.date,
        score: dbData.score || prev.score
      }));
      alert('Data loaded from database successfully!');
    } else {
      alert('No data found for this worksheet ID');
    }
  };

  const handleGenerate = () => {
    const templateData = {
      ...formData,
      sections: formData.useDefault ? sections : []
    };
    onGenerate(templateData);
  };

  return (
    <div className="data-form">
      <div className="form-card">
        <h2>Worksheet Information</h2>
        
        <div className="form-group">
          <label>School Name</label>
          <input
            type="text"
            name="schoolName"
            value={formData.schoolName}
            onChange={handleInputChange}
            placeholder="聖公會基顯小學"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Class Name</label>
            <input
              type="text"
              name="className"
              value={formData.className}
              onChange={handleInputChange}
              placeholder="1B"
            />
          </div>

          <div className="form-group">
            <label>Worksheet ID</label>
            <input
              type="text"
              name="worksheetId"
              value={formData.worksheetId}
              onChange={handleInputChange}
              placeholder="3a"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Date</label>
            <input
              type="text"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              placeholder="Optional"
            />
          </div>

          <div className="form-group">
            <label>Score</label>
            <input
              type="text"
              name="score"
              value={formData.score}
              onChange={handleInputChange}
              placeholder="Optional"
            />
          </div>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="useDefault"
              checked={formData.useDefault}
              onChange={handleInputChange}
            />
            Use default sample content
          </label>
        </div>

        <div className="db-section">
          <h3>Database Integration (Optional)</h3>
          <div className="form-group">
            <label>Fetch from Database by Worksheet ID</label>
            <div className="db-input-group">
              <input
                type="text"
                name="worksheetIdFromDB"
                value={formData.worksheetIdFromDB}
                onChange={handleInputChange}
                placeholder="Enter worksheet ID"
              />
              <button 
                className="fetch-btn"
                onClick={handleFetchFromDB}
                disabled={isGenerating}
              >
                Fetch
              </button>
            </div>
          </div>
        </div>

        <PDFGenerator 
          data={{
            ...formData,
            sections: formData.useDefault ? sections : []
          }}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />
      </div>
    </div>
  );
};

export default DataForm;

