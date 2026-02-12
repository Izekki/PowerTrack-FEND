import React, { useEffect, useRef, useState } from "react";
import "../styles/ConfigurationPage.css";
import { useAuth } from "../context/AuthContext";
import AlertsConfigCard from "../components/ConfigPageComponents/AlertsConfigCard";

const DOMAIN_URL = import.meta.env.VITE_BACKEND_URL;


const ConfigurationPage = () => {
  const [configuraciones, setConfiguraciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeThreshold, setActiveThreshold] = useState({
    id: null,
    field: null,
  });
  const [toastState, setToastState] = useState({ visible: false, message: "" });
  const { userId, token } = useAuth();
  const toastTimer = useRef();
  const highlightTimer = useRef();

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

      return true;
    } catch (error) {
      console.error("Error al actualizar configuración:", error);
      return false;
    }
  };

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
      if (highlightTimer.current) clearTimeout(highlightTimer.current);
    };
  }, []);

  const showToast = (message) => {
    setToastState({ visible: true, message });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => {
      setToastState({ visible: false, message: "" });
    }, 2000);
  };

  const highlightThreshold = (dispositivoId, field) => {
    setActiveThreshold({ id: dispositivoId, field });
    if (highlightTimer.current) clearTimeout(highlightTimer.current);
    highlightTimer.current = setTimeout(() => {
      setActiveThreshold({ id: null, field: null });
    }, 900);
  };

  // Manejadores de cambios
  const handleMinChange = async (dispositivo_id, value) => {
    const newMin = parseFloat(value);
    const conf = configuraciones.find(
      (c) => c.dispositivo_id === dispositivo_id
    );

    if (!conf) return;

    // Validar que esté dentro del rango permitido y sea menor que maximo
    if (newMin < conf.consumo_minimo_w || newMin >= conf.maximo) return;

    const updated = configuraciones.map((c) =>
      c.dispositivo_id === dispositivo_id ? { ...c, minimo: newMin } : c
    );

    setConfiguraciones(updated);
    highlightThreshold(dispositivo_id, "min");

    const ok = await updateMinAndMax(dispositivo_id, newMin, conf.maximo);
    if (ok) {
      showToast(`Umbral minimo actualizado: ${conf.dispositivo_nombre}`);
    }
  };

  const handleMaxChange = async (dispositivo_id, value) => {
    const newMax = parseFloat(value);
    const conf = configuraciones.find(
      (c) => c.dispositivo_id === dispositivo_id
    );

    if (!conf) return;

    // Validar que esté dentro del rango permitido y sea mayor que minimo
    if (newMax > conf.consumo_maximo_w || newMax <= conf.minimo) return;

    const updated = configuraciones.map((c) =>
      c.dispositivo_id === dispositivo_id ? { ...c, maximo: newMax } : c
    );

    setConfiguraciones(updated);
    highlightThreshold(dispositivo_id, "max");

    const ok = await updateMinAndMax(dispositivo_id, conf.minimo, newMax);
    if (ok) {
      showToast(`Umbral maximo actualizado: ${conf.dispositivo_nombre}`);
    }
  };

  return (
    <div className="configurationPage-container">
      <h2 className="configurationPage-title">Configuración</h2>
      <div className="configurationPage-cards">
        <AlertsConfigCard
          loading={loading}
          configuraciones={configuraciones}
          handleMinChange={handleMinChange}
          handleMaxChange={handleMaxChange}
          activeThreshold={activeThreshold}
        />
      </div>
      <div
        className={`config-toast ${toastState.visible ? "show" : ""}`}
        aria-live="polite"
      >
        {toastState.message}
      </div>
    </div>
  );
};

export default ConfigurationPage;
