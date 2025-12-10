import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import "../../styles/ConsumeComponentesCss/TopDevicesList.css"; // Importamos el NUEVO CSS

const DOMAIN_URL = import.meta.env.VITE_BACKEND_URL;

const TopDevicesList = () => {
  const { userId } = useAuth();
  const [deviceList, setDeviceList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDispositivos = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const response = await fetch(`${DOMAIN_URL}/electrical_analysis/consumoPorDispositivosGrupos/${userId}`);
        
        if (!response.ok) throw new Error('Error al obtener los datos');

        const data = await response.json();
        const dispositivos = data.resumenDispositivos || [];
        
        console.log("📊 [TopDevicesList] Datos cargados:", dispositivos);
        setDeviceList(dispositivos);

      } catch (error) {
        console.error("Error cargando Top Devices:", error);
        setDeviceList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDispositivos();
  }, [userId]);

  const maxConsumo = useMemo(() => {
    if (!deviceList || deviceList.length === 0) return 1;
    return Math.max(...deviceList.map(d => Number(d.consumoActualKWh || 0)));
  }, [deviceList]);

  const sortedList = useMemo(() => {
    return [...deviceList].sort((a, b) => 
      (Number(b.consumoActualKWh) || 0) - (Number(a.consumoActualKWh) || 0)
    );
  }, [deviceList]);

  if (loading) {
    return (
      <div className="top-devices-container">
        <h3 className="top-devices-title">Consumo por Dispositivo</h3>
        <p className="no-data-msg">Cargando dispositivos...</p>
      </div>
    );
  }

  return (
    <div className="top-devices-container">
      <h3 className="top-devices-title">Consumo por Dispositivo</h3>
      
      <div className="top-devices-list">
        {sortedList.length > 0 ? (
          sortedList.map((dev, index) => {
            const consumo = Number(dev.consumoActualKWh || 0);
            // Evitar división por cero
            const porcentaje = maxConsumo > 0 ? (consumo / maxConsumo) * 100 : 0;
            const nombre = dev.nombre || dev.dispositivo_nombre || "Sin nombre";

            return (
              <div key={dev.dispositivo_id || dev.id || index} className="top-device-item">
                
                {/* Cabecera: Nombre y Valor */}
                <div className="top-device-header">
                  <span className="top-device-name" title={nombre}>{nombre}</span>
                  <span className="top-device-value">{consumo.toFixed(2)} kWh</span>
                </div>
                
                {/* Barra de Progreso */}
                <div className="progress-track">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${porcentaje}%` }} 
                  ></div>
                </div>

              </div>
            );
          })
        ) : (
          <p className="no-data-msg">No hay dispositivos registrados.</p>
        )}
      </div>
    </div>
  );
};

export default TopDevicesList;