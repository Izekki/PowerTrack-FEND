import React, { useEffect, useState } from "react";
import "../styles/ConfigurationPage.css";
import { useAuth } from "../context/AuthContext";
import AlertsConfigCard from "../components/ConfigPageComponents/AlertsConfigCard";

const DOMAIN_URL = import.meta.env.VITE_BACKEND_URL;


const ConfigurationPage = () => {
  const [configuraciones, setConfiguraciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId, token } = useAuth();

  // Cargar configuraciones del usuario
  useEffect(() => {
    const fetchConfiguraciones = async () => {
      try {
        const response = await fetch(
          `${DOMAIN_URL}/savsetting/configuraciones/usuario/${userId}`,
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

  const updateMinAndMax = async (dispositivo_id, nuevoMin, nuevoMax) => {
    try {
      const response = await fetch(
        `${DOMAIN_URL}/savsetting/update-minmax`,
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
      <div className="configurationPage-cards">
        {/* Tarjeta de Alertas */}
        <AlertsConfigCard
          loading={loading}
          configuraciones={configuraciones}
          handleMinChange={handleMinChange}
          handleMaxChange={handleMaxChange}
        />
      </div>
    </div>
  );
};

export default ConfigurationPage;
