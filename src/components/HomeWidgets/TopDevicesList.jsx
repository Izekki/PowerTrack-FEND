import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import "../../styles/ConsumeComponentesCss/TopDevicesList.css";

const DOMAIN_URL = import.meta.env.VITE_BACKEND_URL;

const TopDevicesList = () => {
  const { userId } = useAuth();
  const [deviceList, setDeviceList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- Estados de Personalización ---
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAddSelect, setShowAddSelect] = useState(false);

  // 1. Inicialización Persistente: Leemos de localStorage al cargar
  const [hiddenDevices, setHiddenDevices] = useState(() => {
    if (!userId) return [];
    try {
      // Buscamos una configuración guardada específica para este usuario
      const saved = localStorage.getItem(`powerTrack_hiddenDevices_${userId}`);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Error al leer preferencias:", error);
      return [];
    }
  });

  // 2. Efecto de Persistencia: Guardamos en localStorage cada vez que cambia la lista oculta
  useEffect(() => {
    if (userId) {
      localStorage.setItem(`powerTrack_hiddenDevices_${userId}`, JSON.stringify(hiddenDevices));
    }
  }, [hiddenDevices, userId]);

  // --- Carga de Datos del Backend ---
  useEffect(() => {
    const fetchDispositivos = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const response = await fetch(`${DOMAIN_URL}/electrical_analysis/consumoPorDispositivosGrupos/${userId}`);
        
        if (!response.ok) throw new Error('Error al obtener los datos');

        const data = await response.json();
        const dispositivos = data.resumenDispositivos || [];
        
        // console.log("📊 [TopDevicesList] Datos cargados:", dispositivos); // Comentado para limpiar consola
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

  // --- Cálculos ---
  const maxConsumo = useMemo(() => {
    if (!deviceList || deviceList.length === 0) return 1;
    return Math.max(...deviceList.map(d => Number(d.consumoActualKWh || 0)));
  }, [deviceList]);

  const sortedFullList = useMemo(() => {
    return [...deviceList].sort((a, b) => 
      (Number(b.consumoActualKWh) || 0) - (Number(a.consumoActualKWh) || 0)
    );
  }, [deviceList]);

  // --- Listas Derivadas ---
  const visibleList = sortedFullList.filter(dev => 
    !hiddenDevices.includes(dev.dispositivo_id || dev.id)
  );

  const hiddenList = sortedFullList.filter(dev => 
    hiddenDevices.includes(dev.dispositivo_id || dev.id)
  );

  // --- Manejadores ---
  const handleHideDevice = (id) => {
    setHiddenDevices(prev => [...prev, id]); // Esto disparará el useEffect de guardado
  };

  const handleShowDevice = (e) => {
    const idToAdd = Number(e.target.value);
    if (!idToAdd) return;

    setHiddenDevices(prev => prev.filter(id => id !== idToAdd)); // Esto también guarda automáticamente
    setShowAddSelect(false);
  };

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
        {visibleList.length > 0 ? (
          visibleList.map((dev, index) => {
            const devId = dev.dispositivo_id || dev.id;
            const consumo = Number(dev.consumoActualKWh || 0);
            const porcentaje = maxConsumo > 0 ? (consumo / maxConsumo) * 100 : 0;
            const nombre = dev.nombre || dev.dispositivo_nombre || "Sin nombre";

            return (
              <div key={devId || index} className="top-device-item">
                
                {isEditMode && (
                  <button 
                    className="remove-device-btn"
                    onClick={() => handleHideDevice(devId)}
                    title="Ocultar dispositivo"
                  >
                    ✕
                  </button>
                )}

                <div className="top-device-header">
                  <span className="top-device-name" title={nombre}>{nombre}</span>
                  <span className="top-device-value">{consumo.toFixed(2)} kWh</span>
                </div>
                
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
          <p className="no-data-msg">
            {hiddenList.length > 0 
              ? "Todos los dispositivos están ocultos." 
              : "No hay dispositivos registrados."}
          </p>
        )}
      </div>

      {isEditMode && (
        <div className="add-device-section">
          {!showAddSelect ? (
            <button 
              className="add-device-btn" 
              onClick={() => setShowAddSelect(true)}
              title="Agregar dispositivo oculto"
              disabled={hiddenList.length === 0}
              style={{ opacity: hiddenList.length === 0 ? 0.5 : 1 }}
            >
              +
            </button>
          ) : (
            <select 
              className="device-select" 
              onChange={handleShowDevice} 
              defaultValue=""
              autoFocus
              onBlur={() => setShowAddSelect(false)}
            >
              <option value="" disabled>Selecciona un dispositivo...</option>
              {hiddenList.map(dev => (
                <option key={dev.dispositivo_id || dev.id} value={dev.dispositivo_id || dev.id}>
                  {dev.nombre || dev.dispositivo_nombre}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      <button 
        className={`edit-mode-trigger ${isEditMode ? 'active' : ''}`}
        onClick={() => {
          setIsEditMode(!isEditMode);
          setShowAddSelect(false);
        }}
        title={isEditMode ? "Terminar edición" : "Editar lista"}
      >
        {isEditMode ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        )}
      </button>

    </div>
  );
};

export default TopDevicesList;