// ModalReporte.jsx
import React, { useState } from "react";
import ReportePDFPage from "./ReportePDFPage";
import '../../styles/ConsumeComponentesCss/ModalReporte.css'

const ModalReporte = ({ reporte, onClose }) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return true;
    } catch (error) {
      console.error('Error al generar PDF:', error);
      return false;
    } finally {
      setTimeout(() => {
        setIsGeneratingPDF(false);
      }, 500);
    }
  };

  return (
    <div className="modal-reporte-overlay">
      <div className="modal-reporte-content">
        <button 
          className="modal-reporte-close" 
          onClick={onClose}
          disabled={isGeneratingPDF}
        >
          &times;
        </button>
        
        <div className="modal-reporte-body">
          <ReportePDFPage 
            reporte={reporte} 
            onGeneratePDF={handleGeneratePDF}
            isGenerating={isGeneratingPDF}
          />
        </div>

        {/* Overlay de carga */}
        {isGeneratingPDF && (
          <div className="pdf-loading-overlay">
            <div className="pdf-loading-content">
              <div className="pdf-loading-spinner"></div>
              <h3>Generando PDF...</h3>
              <p>Por favor espera mientras se procesa tu reporte</p>
              <div className="pdf-loading-progress">
                <div className="pdf-loading-bar"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalReporte;