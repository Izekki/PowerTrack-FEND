import React, { useState, useEffect } from "react"; // Hooks para estado y efectos
import ApexCharts from "react-apexcharts"; // Librería de gráficos
import "../styles/ConsumoPage.css"; // Estilos personalizados

const DOMAIN_URL = import.meta.env.VITE_BACKEND_URL;

// Íconos de consejos
import tip1 from "../assets/tips-icons/tip-1.svg";
import tip2 from "../assets/tips-icons/tip-2.svg";
import tip3 from "../assets/tips-icons/tip-3.svg";

const darkenHex = (hex, amount = 20) => {
  let num = parseInt(hex.replace("#", ""), 16);
  let r = (num >> 16) - amount;
  let g = ((num >> 8) & 0x00FF) - amount;
  let b = (num & 0x0000FF) - amount;

  r = Math.max(r, 0);
  g = Math.max(g, 0);
  b = Math.max(b, 0);

  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

const ConsumoPage = ({ userId }) => {
  // Estados para dispositivos, datos de dispositivos y el consejo visual
  const [devices, setDevices] = useState([]); // Lista de dispositivos
  const [selectedDevice, setSelectedDevice] = useState(null); // Dispositivo seleccionado
  const [deviceData, setDeviceData] = useState([]); // Datos del dispositivo seleccionado
  const [tipActual, setTipActual] = useState(0); // Índice del consejo actual
  const [activeButton, setActiveButton] = useState(null); // Dispositivo activo
  const [loading, setLoading] = useState(true);
  const [deviceDetails, setDeviceDetails] = useState(null); // Detalles del dispositivo seleccionado
  const [showDetails, setShowDetails] = useState(false); // Estado para manejar la visibilidad de detalles adicionales

  // Lista de consejos visuales y su texto
  const tips = [
    { texto: "Apaga las luces y desconecta los aparatos cuando no los uses.", img: tip1 },
    { texto: "Usa bombillos LED para ahorrar energía.", img: tip2 },
    { texto: "Aprovecha la luz natural al máximo.", img: tip3 },
  ];

  // Efecto para cambiar el consejo visual cada 5 segundos
  useEffect(() => {
    const intervalo = setInterval(() => {
      setTipActual((prev) => (prev + 1) % tips.length);
    }, 10000);

    return () => clearInterval(intervalo); // Limpiar intervalo al desmontar el componente
  }, []);
  
  const fetchDevices = () => {
    if (!userId) return;
    setLoading(true);
    fetch(`${DOMAIN_URL}/electrical_analysis/dispositivosPorUsuarios/${userId}/consumo-actual`)
      .then((response) => response.json())
      .then((data) => {
        // Mapea para asegurar que cada item tenga el nombre, ID y consumo actual
        const formattedDevices = data.map(d => ({
          id: d.dispositivo_id,
          dispositivo_nombre: d.dispositivo_nombre,
          consumoActual: d.consumoActual || 0,
          costoActual: d.costoActual || 0
        }));
        setDevices(formattedDevices);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener dispositivos:", error);
        setLoading(false);
      });
  };

  // Función para obtener los detalles del dispositivo
  const fetchDeviceDetails = (deviceId) => {
  fetch(`${DOMAIN_URL}/electrical_analysis/dispositivo/${deviceId}/consumo-detallado`)
    .then((response) => {
      if (!response.ok) {
        // Si la respuesta no es OK, asignamos valores por defecto
        setDeviceDetails({
          estimacionCostoDiario: 0.0,
          estimacionCostoMensual: 0.0,
          unidad: "N/A",
          proveedor: "Desconocido",
          detalleTarifas: {
            cargo_variable: 0.0,
            cargo_fijo: 0.0,
            cargo_distribucion: 0.0,
            cargo_capacidad: 0.0
          }
        });
        console.error("Error al obtener los detalles del dispositivo, respuesta no válida");
      } else {
        return response.json();
      }
    })
    .then((data) => {
      if (data) {
        setDeviceDetails(data); // Almacenar los detalles del dispositivo
      }
    })
    .catch((error) => {
      // Manejo de cualquier otro tipo de error
      console.error("Error al obtener los detalles del dispositivo:", error);
      setDeviceDetails({
        estimacionCostoDiario: 0.0,
        estimacionCostoMensual: 0.0,
        unidad: "N/A",
        proveedor: "Desconocido",
        detalleTarifas: {
          cargo_variable: 0.0,
          cargo_fijo: 0.0,
          cargo_distribucion: 0.0,
          cargo_capacidad: 0.0
        }
      });
    });
};

  
  // Efecto para obtener dispositivos del usuario
  useEffect(() => {
    if (userId) {
      fetchDevices();
    }
  }, [userId]);

  // Función para manejar el clic en los botones de dispositivos
  const handleButtonClick = (deviceId) => {
    if (activeButton === deviceId) {
      // Si ya está activo, desmarcar
      setActiveButton(null);
      setSelectedDevice(null);
      setDeviceDetails(null);
      setShowDetails(false); // Ocultar los detalles al desmarcar el dispositivo
    } else {
      // Marcar nuevo botón y dispositivo
      setActiveButton(deviceId);
      setSelectedDevice(devices.find(device => device.id === deviceId));
      fetchDeviceDetails(deviceId);
      setShowDetails(false); // Asegurar que los detalles estén ocultos al principio
    }
  };

  // Datos para el gráfico
  const series = devices.map(device => device.consumoActual); // aqui va la medición de consumo de cada dispositivo

  // Configuración del gráfico con ApexCharts
  const defaultColors = [
    "#81c784", 
    "#ffeb3b", 
    "#ffa726", 
    "#e53935",  
  ];
  
  const colors = devices.map((device, index) => {
    const baseColor = defaultColors[index % defaultColors.length];
    return device.id === activeButton ? darkenHex(baseColor, 50) : baseColor;
  });

  const chartOptions = {
    chart: {
      type: "pie",
      height: 50,
      width: 50,
      animations: { enabled: true },
      foreColor: "var(--text-primary)",
      fontFamily: "Nunito",
      zoom: { enabled: false },
      selection: { enabled: false },
      toolbar: { show: false },
      events: {
        dataPointSelection: () => false, 
        dataPointMouseEnter: () => false,
        dataPointMouseLeave: () => false,
        click: () => false, 
      },
    },
    plotOptions: {
      pie: {
        offsetX: -75,
        expandOnClick: false, 
        dataLabels: { enabled: false }, 
        donut: {
          labels: { name: {}, value: {}, total: {} },
        },
      },
    },
    fill: {
      colors: colors,
      opacity: 1,
    },
    labels: devices.map((device) => device.dispositivo_nombre),
  };

  const legendOptions = {
    position: "left",
    fontSize: 14,
    offsetX: 25,
    itemMargin: { vertical: 0 },
    markers: { size: 7 },
    onItemClick: {
      toggleDataSeries: false, // ← no ocultar sector al hacer clic en label
    },
    onItemHover: {
      highlightDataSeries: false, // ← no resaltar sector al pasar el mouse
    },
  };

  const tooltipOptions = {
    hideEmptySeries: false,
    fillSeriesColor: true,
    theme: "dark",
  };

  const options = { ...chartOptions, legend: legendOptions, tooltip: tooltipOptions };

  return (
    <div className="consumo-card">
      <div className="consumo-container">
        
        {/* Columna izquierda: título y botones de dispositivos */}
        <div className="columna-izquierda">
          <h3 className="title-consumotitle">Hogar 1</h3>
          <div className="dispositivos-lista">
            {devices.length > 0 ? (
              devices.map((device) => (
                <button
                  key={device.id}
                  className={`dispositivo-btn ${activeButton === device.id ? 'active' : ''}`}
                  onClick={() => handleButtonClick(device.id)}
                >
                  {device.dispositivo_nombre}
                </button>
              ))
            ) : (
              <span>No hay dispositivos registrados</span>
            )}
          </div>
          <div className="view-more">
            <button className="ver-mas-btn">Más informacion</button>
          </div>
        </div>

        {/* Columna derecha: gráfico, datos y consejo */}
        <div className="columna-derecha">
          <h4 className="graph-title">Consumo Dispositivos</h4>
          <div className="graph-container">
            <ApexCharts 
              key={JSON.stringify({ devices, activeButton })} 
              options={options} 
              series={series} 
              type="pie" 
              height={300}
            />
          </div>

         {selectedDevice && (
          <div className="mini-modal-cost">
            <h5>Detalle de Consumo</h5>
            <p><strong>Dispositivo:</strong> {selectedDevice.dispositivo_nombre}</p>
            <p><strong>Costo estimado:</strong> ${selectedDevice.costoActual.toFixed(2)} MXN</p>
            <button 
              className="ver-detalles-btn" 
              onClick={() => setShowDetails(!showDetails)} // Alternar visibilidad de detalles
            >
              {showDetails ? "Ver menos" : "Ver más"}
            </button>

            {showDetails && deviceDetails && (
              <div className="expanded-modal">
                <h6>Detalles Adicionales</h6>
                <p><strong>Estimación Costo Diario:</strong> ${deviceDetails.estimacionCostoDiario.toFixed(2)} MXN</p>
                <p><strong>Estimación Costo Mensual:</strong> ${deviceDetails.estimacionCostoMensual.toFixed(2)} MXN</p>
                <p><strong>Unidad de Medición:</strong> {deviceDetails.unidad}</p>
                <p><strong>Proveedor:</strong> {deviceDetails.proveedor}</p>
                <div className="detalle-tarifas">
                  <h6>Detalle de Tarifas:</h6>
                  <p><strong>Cargo Variable:</strong> ${deviceDetails.detalleTarifas.cargo_variable.toFixed(2)}</p>
                  <p><strong>Cargo Fijo:</strong> ${deviceDetails.detalleTarifas.cargo_fijo.toFixed(2)}</p>
                  <p><strong>Cargo Distribución:</strong> ${deviceDetails.detalleTarifas.cargo_distribucion.toFixed(2)}</p>
                  <p><strong>Cargo Capacidad:</strong> ${deviceDetails.detalleTarifas.cargo_capacidad.toFixed(2)}</p>
                </div>
              </div>
            )}
          </div>
        )}


          <h4 className="graph-title">Datos Dispositivos</h4>
          <div className="datos-consumo">
            {devices.map(device => (
              <span
                key={device.id}
                  className={`datos-consumo-span ${activeButton === device.id ? 'active' : ''}`}
              >
                {device.dispositivo_nombre} = {device.consumoActual ?? 0} kWh
              </span>
            ))}
          </div>

          {/* Consejo visual rotativo */}
          <div className="consejo">
            <img src={tips[tipActual].img} alt="Tip" className="tip-icon" />
            <div className="tip-texto">
              <h4>Consejo:</h4>
              <p>{tips[tipActual].texto}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsumoPage;
