import React from "react";

/**
 * Widget que muestra el resumen de dispositivos y grupos.
 * Diseñado para ser reutilizable en ProfilePage o HomeDashboard.
 */
const SummaryWidget = ({ dispositivos = [], grupos = [], totalDispositivos = 0, totalGrupos = 0 }) => {
  return (
    <div className="profilePage-card profileCard-summary">
      <h3 className="profileCard-title">Resumen</h3>

      {/* Sección Dispositivos */}
      <div className="profileCard-subsection">
        <h4>Dispositivos ({totalDispositivos})</h4>
        {dispositivos.length > 0 ? (
          <ul className="profileCard-list">
            {dispositivos.map((d) => (
              <li key={d.id} className="profileCard-item">
                <strong>{d.nombre}</strong> <span>- {d.ubicacion}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ fontStyle: "italic", color: "var(--text-secondary)" }}>
            No hay dispositivos registrados.
          </p>
        )}
      </div>

      {/* Sección Grupos */}
      <div className="profileCard-subsection">
        <h4>Grupos ({totalGrupos})</h4>
        {grupos.length > 0 ? (
          <ul className="profileCard-list">
            {grupos.map((g) => (
              <li key={g.id} className="profileCard-item">
                <strong>{g.nombre}</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ fontStyle: "italic", color: "var(--text-secondary)" }}>
            No hay grupos registrados.
          </p>
        )}
      </div>
    </div>
  );
};

export default SummaryWidget;