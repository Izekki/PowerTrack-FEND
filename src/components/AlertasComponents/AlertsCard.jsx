import React from 'react';
import '../../styles/AlertsComponentesCss/AlertsCard.css';

// Importa todos los íconos al cargar el componente
const alertIcons = import.meta.glob('../../assets/alerts-icons/*.{png,svg}', {
  eager: true,
  import: 'default',
});

const AlertsCard = ({ name, iconoId, nivel, fecha, tipo }) => {
  // Encuentra el ícono que coincide con el ID (ej: 'a1', 'a2')
  const matchingPath = Object.keys(alertIcons).find(path => path.includes(`${iconoId}.`));
  const iconSrc = matchingPath ? alertIcons[matchingPath] : null;

  return (
    <div className={`alert-card ${nivel?.toLowerCase() || ''}`}>
      <div className="alert-icon">
        {iconSrc ? (
          <img src={iconSrc} alt={`Icono ${iconoId}`} />
        ) : (
          <span>🔔</span>
        )}
      </div>
      <div className="alert-info">
        <p className="alert-message">{name}</p>
        <div className="alert-meta">
          <span className="alert-tipo">Tipo: <strong>{tipo} </strong></span>
          <span className="alert-fecha">Fecha: {fecha}</span>
        </div>
      </div>
    </div>
  );
};

export default AlertsCard;
