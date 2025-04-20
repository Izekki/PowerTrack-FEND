import React, { useEffect, useState } from "react";
import "../styles/ConfigurationPage.css";
import { useTheme } from "next-themes"; // Importar useTheme

const ConfigurationPage = ({ userId, token }) => {
  const { theme, setTheme } = useTheme(); // Usar el hook de next-themes
  const [selectedTheme, setSelectedTheme] = useState(theme);

  useEffect(() => {
    // Establecer el tema actual al iniciar
    setSelectedTheme(theme);
  }, [theme]);

  const handleThemeChange = (event) => {
    const newTheme = event.target.value;
    setTheme(newTheme); // Cambiar el tema
    setSelectedTheme(newTheme);
  };

  return (
    <div className="configurationPage-container">
      <h2 className="configurationPage-title">Configuración</h2>
      <div className="configurationPage-cards">

        {/* Tarjeta de Alertas */}
        <div className="configurationCard configurationCard-alerts">
          <h3 className="configurationCard-title">Alertas</h3>
          <p className="configurationCard-text">Próximamente podrás gestionar tus alertas personalizadas aquí.</p>
        </div>

        {/* Tarjeta de Accesibilidad */}
        <div className="configurationCard configurationCard-accessibility">
          <h3 className="configurationCard-title">Accesibilidad</h3>

          <div className="configurationCard-section">
            <label className="configurationCard-label">Tema:</label>
            <select
              className="configurationCard-select"
              value={selectedTheme}
              onChange={handleThemeChange}
            >
              <option value="light">Claro</option>
              <option value="dark">Oscuro</option>
            </select>
          </div>
          {/*
          <div className="configurationCard-section">
            <label className="configurationCard-label">Idioma:</label>
            <select className="configurationCard-select">
              <option value="es">Español</option>
              <option value="en">Inglés</option>
            </select>
          </div>
           */}
          
        </div>

      </div>
    </div>
  );
};

export default ConfigurationPage;
