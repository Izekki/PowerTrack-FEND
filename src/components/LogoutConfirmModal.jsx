import React from 'react';
import '../styles/LogoutConfirmModal.css';

const LogoutConfirmModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay-logout">
      <div className="modal-content-logout">
        <h1 className='Title-logout'>¿Deseas cerrar sesión?</h1>
        <p className='logout-menssage'>¿Confirmas que deseas cerrar sesión? <strong className='ImissU'>Te extrañare :(</strong></p>
        <div className="modal-actions-logout">
          <button onClick={onCancel} className="btn-style-default cancel-button">Cancelar</button>
          <button onClick={onConfirm} className="btn-style-default confirm-button">Confirmar</button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmModal;
