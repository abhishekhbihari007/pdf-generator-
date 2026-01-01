import React, { useState } from 'react';
import './App.css';
import PDFGenerator from './components/PDFGenerator';
import DataForm from './components/DataForm';

function App() {
  const [templateData, setTemplateData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePDF = async (data) => {
    setIsGenerating(true);
    setTemplateData(data);
    
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateData: data,
          options: {
            format: 'A4',
            margin: {
              top: '20mm',
              right: '15mm',
              bottom: '20mm',
              left: '15mm'
            }
          }
        }),
      });

      if (!response.ok) {
        throw new Error('PDF generation failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `worksheet_${data.className}_${data.worksheetId || 'default'}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please check the console for details.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFetchFromDB = async (worksheetId) => {
    try {
      const response = await fetch('/api/fetch-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: 'SELECT * FROM worksheets WHERE worksheet_id = ?',
          params: [worksheetId]
        }),
      });

      const result = await response.json();
      if (result.success && result.data.length > 0) {
        // Transform database data to template format
        // This would need to be customized based on your database schema
        return result.data[0];
      }
      return null;
    } catch (error) {
      console.error('Error fetching from database:', error);
      return null;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Automated A4 PDF Generation System</h1>
        <p>Generate professional educational worksheets with precise typography and print standards</p>
      </header>
      
      <main className="App-main">
        <DataForm 
          onGenerate={handleGeneratePDF}
          onFetchFromDB={handleFetchFromDB}
          isGenerating={isGenerating}
        />
        
        {templateData && (
          <div className="preview-section">
            <h2>Last Generated Template Data</h2>
            <pre>{JSON.stringify(templateData, null, 2)}</pre>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

