import React from 'react';
import '../../styles/CommonComponentsCss/DeleteConfirmModal.css';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirmar acción", 
  message = "¿Estás seguro de que quieres realizar esta acción?",
  confirmButtonText = "Confirmar",
  cancelButtonText = "Cancelar",
  type = "warning" // warning, danger, info
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="confirmation-modal">
        <div className={`modal-header ${type}`}>
          <h2>{title}</h2>
          <button className="close-button" onClick={onClose} aria-label="Cerrar">
            &times;
          </button>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          <button 
            className="cancel-button" 
            onClick={onClose}
          >
            {cancelButtonText}
          </button>
          <button 
            className={`confirm-button ${type}`} 
            onClick={onConfirm}
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;