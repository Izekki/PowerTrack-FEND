import React from "react";
import { useNavigate } from "react-router-dom";
import { useContrast } from "../../context/ContrastContext";

const AccessibilityCard = ({ selectedTheme, handleThemeChange }) => {
  const { contrastLevel } = useContrast();
  const navigate = useNavigate();

  const contrastLabels = {
    normal: "Contraste Normal",
    high: "Contraste Alto",
    "very-high": "Contraste Muy Alto",
  };

  return (
    <div className="configurationCard configurationCard-accessibility">
      <h3 className="profileCard-title">Accesibilidad</h3>

      <div className="configurationCard-section theme-selector">
        <label className="configurationCard-label" htmlFor="theme-select">
          Tema:
        </label>
        <div className="custom-select-wrapper">
          <select
            id="theme-select"
            className="custom-select"
            value={selectedTheme}
            onChange={handleThemeChange}
          >
            <option value="light">Claro</option>
            <option value="dark">Oscuro</option>
          </select>
        </div>
      </div>

      <div className="configurationCard-section contrast-info">
        <label className="configurationCard-label">Contraste:</label>
        <div className="contrast-info-display">
          <span className="contrast-current">{contrastLabels[contrastLevel]}</span>
          <button
            type="button"
            className="contrast-edit-btn"
            onClick={() => navigate("/contraste")}
            aria-label="Editar opciones de contraste"
          >
            Configurar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityCard;
