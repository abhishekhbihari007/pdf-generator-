import React from 'react';
import './PDFGenerator.css';

const PDFGenerator = ({ data, onGenerate, isGenerating }) => {
  return (
    <div className="pdf-generator">
      <button 
        className="generate-btn"
        onClick={() => onGenerate(data)}
        disabled={isGenerating}
      >
        {isGenerating ? 'Generating PDF...' : 'Generate PDF'}
      </button>
    </div>
  );
};

export default PDFGenerator;

