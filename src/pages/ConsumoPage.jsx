import React, { useEffect, useState } from "react";
import DeviceConsumeList from "../components/ConsumoComponets/DeviceConsumeList";
import DeviceConsumeChart from "../components/ConsumoComponets/DeviceConsumeChart";
import DeviceDetailConsumeModal from "../components/ConsumoComponets/DeviceDetailConsumeModal";
import EnergyTip from "../components/ConsumoComponets/EnergyTip";
import DeviceDataDisplay from "../components/ConsumoComponets/DeviceDataDisplay";
import { useAuth } from "../context/AuthContext";
import "../styles/ConsumoPage.css";

import tip1 from "../assets/tips-icons/tip-1.svg";
import tip2 from "../assets/tips-icons/tip-2.svg";
import tip3 from "../assets/tips-icons/tip-3.svg";

const DOMAIN_URL = import.meta.env.VITE_BACKEND_URL;

const ConsumoPage = () => {
  const { userId } = useAuth();
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [deviceDetails, setDeviceDetails] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeButton, setActiveButton] = useState(null);

  const tips = [
    { texto: "Apaga las luces y desconecta los aparatos cuando no los uses.", img: tip1, titulo: "Consejo 1" },
    { texto: "Usa bombillos LED para ahorrar energía.", img: tip2, titulo: "Consejo 2" },
    { texto: "Aprovecha la luz natural al máximo.", img: tip3, titulo: "Consejo 3" },
  ];

  useEffect(() => {
    if (userId) {
      fetch(`${DOMAIN_URL}/electrical_analysis/dispositivosPorUsuarios/${userId}/consumo-actual`)
        .then((res) => res.json())
        .then((data) => {
          const formatted = data.map(d => ({
            id: d.dispositivo_id,
            dispositivo_nombre: d.dispositivo_nombre,
            consumoActual: d.consumoActual || 0,
            costoActual: d.costoActual || 0,
          }));
          setDevices(formatted);
        });
    }
  }, [userId]);

  const fetchDeviceDetails = (deviceId) => {
    fetch(`${DOMAIN_URL}/electrical_analysis/dispositivo/${deviceId}/consumo-detallado`)
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        setDeviceDetails(data || {
          estimacionCostoDiario: 0,
          estimacionCostoMensual: 0,
          unidad: "N/A",
          proveedor: "Desconocido",
          detalleTarifas: {
            cargo_variable: 0,
            cargo_fijo: 0,
            cargo_distribucion: 0,
            cargo_capacidad: 0,
          },
        });
      });
  };

  const handleDeviceClick = (deviceId) => {
    if (activeButton === deviceId) {
      setActiveButton(null);
      setSelectedDevice(null);
      setDeviceDetails(null);
      setShowDetails(false);
    } else {
      const device = devices.find(d => d.id === deviceId);
      setActiveButton(deviceId);
      setSelectedDevice(device);
      fetchDeviceDetails(deviceId);
      setShowDetails(false);
    }
  };

  return (
    <div className="consumo-card">
      <div className="consumo-container">
        <div className="columna-izquierda">
          <h3 className="title-consumotitle">Hogar 1</h3>
          <DeviceConsumeList
            devices={devices}
            activeButton={activeButton}
            onDeviceClick={handleDeviceClick}
          />
          <div className="view-more">
            <button className="ver-mas-btn">Más información</button>
          </div>
        </div>

        <div className="columna-derecha">
          <h4 className="graph-title">Consumo Dispositivos</h4>
          <div className="graph-container">
            <DeviceConsumeChart devices={devices} activeButton={activeButton} />
          </div>
          <DeviceDetailConsumeModal
            selectedDevice={selectedDevice}
            deviceDetails={deviceDetails}
            showDetails={showDetails}
            toggleDetails={() => setShowDetails(!showDetails)}
          />
          <h4 className="graph-title">Datos Dispositivos</h4>
          <DeviceDataDisplay devices={devices} activeButton={activeButton}/>
          <EnergyTip tips={tips} />
        </div>
      </div>
    </div>
  );
};

export default ConsumoPage;
