import React from 'react';
import '../../styles/AlertsComponentesCss/AlertsCard.css';
import AlertIcon from '../../assets/tips-icons/tip-1.svg'; // Ícono por defecto, puedes cambiarlo

const AlertsCard = ({ name, nivel, fecha, tipo }) => {
  return (
    <div className={`alert-card ${nivel?.toLowerCase() || ''}`}>
      <div className="alert-icon">
        <img src={AlertIcon} alt="Icono de alerta" />
      </div>
      <div className="alert-info">
        <p className="alert-message">{name}</p>
        <div className="alert-meta">
          <span className="alert-nivel">Nivel:<strong> {nivel || 'Sin nivel '}</strong></span>
          <span className="alert-tipo"> Tipo: <strong>{tipo}</strong></span>
          <span className="alert-fecha"> Fecha: {fecha}</span>
        </div>
      </div>
    </div>
  );
};

export default AlertsCard;
