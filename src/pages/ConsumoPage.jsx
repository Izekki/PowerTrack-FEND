import React, { useEffect, useState } from "react";
import DeviceConsumeList from "../components/ConsumoComponets/DeviceConsumeList";
import DeviceConsumeChart from "../components/ConsumoComponets/DeviceConsumeChart";
import DeviceDetailConsumeModal from "../components/ConsumoComponets/DeviceDetailConsumeModal";
import EnergyTip from "../components/ConsumoComponets/EnergyTip";
import DeviceDataDisplay from "../components/ConsumoComponets/DeviceDataDisplay";
import { useAuth } from "../context/AuthContext";
import "../styles/ConsumoPage.css";
import { useNavigate } from "react-router-dom";


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
  const [activeGroupButton, setActiveGroupButton] = useState(null);
  const [activeDeviceButton, setActiveDeviceButton] = useState(null);
  const [chartDevices, setChartDevices] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState([]);
  const [displayMode, setDisplayMode] = useState("kwh");
  const devicesWithoutGroup = devices.filter(d => d.grupo_id === null);
  const navigate = useNavigate();

  const tips = [
    { texto: "Apaga las luces y desconecta los aparatos cuando no los uses.", img: tip1, titulo: "Consejo 1" },
    { texto: "Usa bombillos LED para ahorrar energía.", img: tip2, titulo: "Consejo 2" },
    { texto: "Aprovecha la luz natural al máximo.", img: tip3, titulo: "Consejo 3" },
  ];

  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (userId) {
      fetch(`${DOMAIN_URL}/electrical_analysis/consumoPorDispositivosGrupos/${userId}`)
        .then(res => res.json())
        .then(data => {
          console.log("Datos recibidos:", data);
          const formattedDevices = data.resumenDispositivos.map(d => ({
            id: d.dispositivo_id,
            dispositivo_nombre: d.nombre,
            consumoActual: d.consumoActualKWh || 0,
            costoActual: Number(d.costoPorMedicionMXN) || 0,
            grupo_id: d.grupo_id,
          }));

          const formattedGroups = data.resumenGrupos
          .filter(g => g.grupo_id !== null)
          .map(g => ({
            id: g.grupo_id,
            nombre: g.nombre || `Grupo ${g.grupo_id}`,
            consumoActual: g.consumoTotalKWh || 0,
            costoActual: Number(
              g.costoTotalMXN ?? g.costoTotalPeriodoMXN ?? g.costoMensualTotalMXN ?? 0
            ) || 0,
          }));

          setDevices(formattedDevices);
          setGroups(formattedGroups);

          const initialChartDevices = [
          ...formattedDevices
            .filter(d => d.grupo_id === null)
            .map(d => ({
              id: d.id,
              nombre: d.dispositivo_nombre,
              consumoActual: d.consumoActual,
              costoActual: d.costoActual,
              tipo: 'dispositivo',
            })),
          ...formattedGroups.map(g => ({
            id: `group-${g.id}`,
            nombre: g.nombre,
            consumoActual: g.consumoActual,
            costoActual: g.costoActual,
            tipo: 'grupo',
          })),
        ];
        setChartDevices(initialChartDevices);
        });
    }
  }, [userId]);

  const fetchDeviceDetails = (deviceId) => {
    fetch(`${DOMAIN_URL}/electrical_analysis/dispositivo/${deviceId}/consumo-detallado`)
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener detalles');
        return res.json();
      })
      .then(data => {
        setDeviceDetails(data);
      })
      .catch(() => {
        setDeviceDetails({
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

  const handleGroupClick = (buttonId, groupId) => {
    if (activeGroupButton === buttonId) {
      setActiveGroupButton(null);
      setSelectedGroup(null);
      setExpandedGroups(prev => prev.filter(id => id !== groupId));
      setSelectedDevice(null);
      setActiveDeviceButton(null);
      setDeviceDetails(null);
      setShowDetails(false);

      const allDevices = [
        ...devices.filter(d => d.grupo_id === null).map(d => ({
          id: d.id,
          nombre: d.dispositivo_nombre,
          consumoActual: d.consumoActual,
          costoActual: d.costoActual,
          tipo: 'dispositivo',
        })),
        ...groups.map(g => ({
          id: `group-${g.id}`,
          nombre: g.nombre,
          consumoActual: g.consumoActual,
          costoActual: g.costoActual,
          tipo: 'grupo',
        })),
      ];
      setChartDevices(allDevices);
    } else {
      setActiveGroupButton(buttonId);
      setSelectedGroup(groups.find(g => g.id === groupId));
      setExpandedGroups([groupId]);

      setSelectedDevice(null);
      setActiveDeviceButton(null);
      setDeviceDetails(null);
      setShowDetails(false);

      const devicesInGroup = devices
        .filter(d => d.grupo_id === groupId)
        .map(d => ({
          id: d.id,
          nombre: d.dispositivo_nombre,
          consumoActual: d.consumoActual,
          costoActual: d.costoActual,
          tipo: 'dispositivo',
        }));
      setChartDevices(devicesInGroup);
    }
  };

  const handleDeviceClick = (deviceId, grupoId) => {
    if (activeDeviceButton === deviceId) {
      // Deseleccionar dispositivo
      setActiveDeviceButton(null);
      setSelectedDevice(null);
      setDeviceDetails(null);
      setShowDetails(false);

      if (grupoId === null) {
      setExpandedGroups([]);
      setActiveGroupButton(null);
      setSelectedGroup(null);

      const allDevices = [
        ...devices.filter(d => d.grupo_id === null).map(d => ({
          id: d.id,
          nombre: d.dispositivo_nombre,
          consumoActual: d.consumoActual,
          costoActual: d.costoActual,
          tipo: 'dispositivo',
        })),
        // Aquí asegúrate de incluir los grupos siempre
        ...groups.map(g => ({
          id: `group-${g.id}`,
          nombre: g.nombre,
          consumoActual: g.consumoActual, // usa consumo total del grupo
          costoActual: g.costoActual,
          tipo: 'grupo',
        })),
      ];
      setChartDevices(allDevices);
    }
} else {
      setActiveDeviceButton(deviceId);
      setSelectedDevice(devices.find(d => d.id === deviceId));
      fetchDeviceDetails(deviceId);
      setShowDetails(false);

      if (grupoId === null) {
        setExpandedGroups([]);
        setActiveGroupButton(null);
        setSelectedGroup(null);

        const allDevices = [
          ...devices.filter(d => d.grupo_id === null).map(d => ({
            id: d.id,
            nombre: d.dispositivo_nombre,
            consumoActual: d.consumoActual,
            costoActual: d.costoActual,
            tipo: 'dispositivo',
          })),
          // Aquí asegúrate de incluir los grupos siempre
          ...groups.map(g => ({
            id: `group-${g.id}`,
            nombre: g.nombre,
            consumoActual: g.consumoActual, // usa consumo total del grupo
            costoActual: g.costoActual,
            tipo: 'grupo',
          })),
        ];
        setChartDevices(allDevices);
      } else {
        if (!expandedGroups.includes(grupoId)) {
          setExpandedGroups([grupoId]);
        }
        setActiveGroupButton(`group-${grupoId}`);
        setSelectedGroup(groups.find(g => g.id === grupoId));

        const devicesInGroup = [
          {
            id: `group-${groupId}`,
            nombre: groups.find(g => g.id === groupId)?.nombre || 'Grupo',
            consumoActual: groups.find(g => g.id === groupId)?.consumoActual || 0,
            costoActual: groups.find(g => g.id === groupId)?.costoActual || 0,
            tipo: 'grupo',
          },
          ...devices
            .filter(d => d.grupo_id === groupId)
            .map(d => ({
              id: d.id,
              nombre: d.dispositivo_nombre,
              consumoActual: d.consumoActual,
              costoActual: d.costoActual,
              tipo: 'dispositivo',
            }))
        ];
        setChartDevices(devicesInGroup);

      }
    }
  };

  // Prepara los datos visibles para DeviceDataDisplay
  const visibleDevices = activeGroupButton
    ? devices.filter(d => d.grupo_id === parseInt(activeGroupButton.replace('group-', '')))
    : devicesWithoutGroup;

  const visibleGroups = activeGroupButton
    ? groups.filter(g => `group-${g.id}` === activeGroupButton)
    : groups;

  return (
    <div className="consumo-card">
      <div className="consumo-container">
        <div className="columna-izquierda">
          <DeviceConsumeList
            devices={devices}
            groups={groups}
            activeGroupButton={activeGroupButton}
            activeDeviceButton={activeDeviceButton}
            onDeviceClick={handleDeviceClick}
            onGroupClick={handleGroupClick}
            expandedGroups={expandedGroups}
          />
          <div className="view-more">
            <button className="ver-mas-btn" onClick={() => navigate("/historial")}>
              Más información
            </button>
          </div>
        </div>

        <div className="columna-derecha">
          <div className="consumo-chart-header">
            <h4 className="graph-title">Consumo Dispositivos</h4>
            <div className="consumo-mode-toggle" role="tablist" aria-label="Filtro de consumo">
              <button
                className={displayMode === "kwh" ? "active" : ""}
                onClick={() => setDisplayMode("kwh")}
                type="button"
                aria-pressed={displayMode === "kwh"}
              >
                kWh
              </button>
              <button
                className={displayMode === "mxn" ? "active" : ""}
                onClick={() => setDisplayMode("mxn")}
                type="button"
                aria-pressed={displayMode === "mxn"}
              >
                MXN
              </button>
            </div>
          </div>
          <div className="graph-container">
            <DeviceConsumeChart
              devices={chartDevices}
              activeDeviceButton={activeDeviceButton}
              displayMode={displayMode}
            />
          </div>
          <DeviceDetailConsumeModal
            selectedDevice={selectedDevice}
            deviceDetails={deviceDetails}
            showDetails={showDetails}
            toggleDetails={() => setShowDetails(!showDetails)}
          />
          <h4 className="graph-title">Datos Dispositivos</h4>
          <DeviceDataDisplay 
            groups={visibleGroups}
            devices={visibleDevices}
            activeGroupButton={activeGroupButton}
            activeDeviceButton={activeDeviceButton}
            displayMode={displayMode}
          />
          <EnergyTip tips={tips} />
        </div>
      </div>
    </div>
  );
};

export default ConsumoPage;
