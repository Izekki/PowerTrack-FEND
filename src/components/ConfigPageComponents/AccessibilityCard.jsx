import React from "react";

const AccessibilityCard = ({ selectedTheme, handleThemeChange }) => {
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
    </div>
  );
};

export default AccessibilityCard;
