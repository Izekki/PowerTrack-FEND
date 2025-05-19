// src/components/AlertsCard.jsx
import React from 'react';
import '../../styles/AlertsComponentesCss/AlertsCard.css';

const AlertsCard = ({ icon, name }) => {
  return (
    <div className="alert-card">
      <div className="alert-icon">{icon}</div>
      <div className="alert-name">{name}</div>
    </div>
  );
};

export default AlertsCard;
