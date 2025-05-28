import React, { useEffect, useState } from "react";
import "../styles/ConfigurationPage.css";
import { useTheme } from "next-themes";
import { useAuth } from "../context/AuthContext";

const ConfigurationPage = () => {
  const { theme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [configuraciones, setConfiguraciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId, token } = useAuth();

  useEffect(() => {
    setSelectedTheme(theme);
  }, [theme]);

  // Cargar configuraciones del usuario
  useEffect(() => {
    const fetchConfiguraciones = async () => {
      try {
        const response = await fetch(
          `http://localhost:5051/savsetting/configuraciones/usuario/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        // Convertir minimo y maximo a números
        const formatted = data.configuraciones.map((conf) => ({
          ...conf,
          minimo: parseFloat(conf.minimo),
          maximo: parseFloat(conf.maximo),
        }));

        setConfiguraciones(formatted);
      } catch (error) {
        console.error("Error al cargar configuraciones:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchConfiguraciones();
  }, [userId, token]);

  const handleThemeChange = (event) => {
    const newTheme = event.target.value;
    setTheme(newTheme);
    setSelectedTheme(newTheme);
  };

  const updateMinAndMax = async (dispositivo_id, nuevoMin, nuevoMax) => {
    try {
      const response = await fetch(
        "http://localhost:5051/savsetting/update-minmax",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            dispositivo_id,
            minimo: nuevoMin,
            maximo: nuevoMax,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar");
      }
    } catch (error) {
      console.error("Error al actualizar configuración:", error);
    }
  };

  // Manejadores de cambios
  const handleMinChange = (dispositivo_id, value) => {
    const newMin = parseFloat(value);
    const conf = configuraciones.find(
      (c) => c.dispositivo_id === dispositivo_id
    );

    // Validar que esté dentro del rango permitido y sea menor que maximo
    if (newMin < conf.consumo_minimo_w || newMin >= conf.maximo) return;

    const updated = configuraciones.map((c) =>
      c.dispositivo_id === dispositivo_id ? { ...c, minimo: newMin } : c
    );

    setConfiguraciones(updated);
    updateMinAndMax(dispositivo_id, newMin, conf.maximo);
  };

  const handleMaxChange = (dispositivo_id, value) => {
    const newMax = parseFloat(value);
    const conf = configuraciones.find(
      (c) => c.dispositivo_id === dispositivo_id
    );

    // Validar que esté dentro del rango permitido y sea mayor que minimo
    if (newMax > conf.consumo_maximo_w || newMax <= conf.minimo) return;

    const updated = configuraciones.map((c) =>
      c.dispositivo_id === dispositivo_id ? { ...c, maximo: newMax } : c
    );

    setConfiguraciones(updated);
    updateMinAndMax(dispositivo_id, conf.minimo, newMax);
  };

  return (
    <div className="configurationPage-container">
      <h2 className="configurationPage-title">Configuración</h2>
      <div className="configurationPage-cards">
        {/* Tarjeta de Alertas */}
        <div className="configurationCard configurationCard-alerts">
          <h3 className="configurationCard-title">Alertas</h3>

          {loading ? (
            <p>Cargando configuraciones...</p>
          ) : configuraciones.length === 0 ? (
            <p>No hay dispositivos configurados.</p>
          ) : (
            <ul className="alerts-list">
              {configuraciones.map((conf) => (
                <li key={conf.configuracion_id} className="alert-item">
                  <div className="alert-header">
                    <strong>{conf.dispositivo_nombre}</strong> -{" "}
                    <small>{conf.tipo_dispositivo}</small>
                  </div>

                  <div className="alert-slider-group">
                    <label className="alert-slider-label">
                      Mínimo ({(conf.minimo / 1000).toFixed(2)} kW)
                      <input
                        type="range"
                        min={parseFloat(conf.consumo_minimo_w)}
                        max={parseFloat(conf.consumo_maximo_w)}
                        step="1"
                        value={conf.minimo}
                        onChange={(e) =>
                          handleMinChange(conf.dispositivo_id, e.target.value)
                        }
                      />
                    </label>

                    <label className="alert-slider-label">
                      Máximo ({(conf.maximo / 1000).toFixed(2)} kW)
                      <input
                        type="range"
                        min={parseFloat(conf.consumo_minimo_w)}
                        max={parseFloat(conf.consumo_maximo_w)}
                        step="1"
                        value={conf.maximo}
                        onChange={(e) =>
                          handleMaxChange(conf.dispositivo_id, e.target.value)
                        }
                      />
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Tarjeta de Accesibilidad */}
        <div className="configurationCard configurationCard-accessibility">
          <h3 className="configurationCard-title">Accesibilidad</h3>

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
      </div>
    </div>
  );
};

export default ConfigurationPage;
