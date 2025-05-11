import React, { useState, useEffect } from "react"; // Hooks para estado y efectos
import ApexCharts from "react-apexcharts"; // Librería de gráficos
import "../styles/ConsumoPage.css"; // Estilos personalizados

const DOMAIN_URL = import.meta.env.VITE_BACKEND_URL;

// Íconos de consejos
import tip1 from "../assets/tips-icons/tip-1.svg";
import tip2 from "../assets/tips-icons/tip-2.svg";
import tip3 from "../assets/tips-icons/tip-3.svg";

const ConsumoPage = ({ userId }) => {
  // Estados para dispositivos, datos de dispositivos y el consejo visual
  const [devices, setDevices] = useState([]); // Lista de dispositivos
  const [selectedDevice, setSelectedDevice] = useState(null); // Dispositivo seleccionado
  const [deviceData, setDeviceData] = useState([]); // Datos del dispositivo seleccionado
  const [tipActual, setTipActual] = useState(0); // Índice del consejo actual
  const [activeButton, setActiveButton] = useState(null); // Dispositivo activo
  const [loading, setLoading] = useState(true);

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
  
  // Efecto para obtener dispositivos del usuario
  useEffect(() => {
      if (userId) {
        fetchDevices();
      }
    }, [userId]);

  /* Función para obtener datos de un dispositivo
  const fetchDeviceData = (deviceId) => {
    const fechaInicio = '2025-05-10 04:56:50'; // Reemplazar con valores dinámicos o predeterminados
    const fechaFinal = '2025-05-10 04:56:50'; // Reemplazar con valores dinámicos o predeterminados

    fetch(`${import.meta.env.VITE_BACKEND_URL}/electrical_analysis/consumo_d/${deviceId}?fechaInicio=${fechaInicio}&fechaFinal=${fechaFinal}`)
      .then((res) => res.json())
      .then((data) => setDeviceData(data.datos.map(d => d.consumoKWh))) // Solo tomamos el consumoKWh para el gráfico
      .catch((err) => console.error("Error al obtener datos del dispositivo:", err));
  }; */

  // Función para manejar el clic en los botones de dispositivos
  const handleButtonClick = (deviceId) => {
    setSelectedDevice(devices.find(device => device.id === deviceId));
    // fetchDeviceData(deviceId);
    setActiveButton(deviceId);
  };

  
  // Datos para el gráfico
  const series = devices.map(device => device.consumoActual); // aqui va la medición de consumo de cada dispositivo

  // Configuración del gráfico con ApexCharts
  const chartOptions = {
    chart: {
      type: "pie",
      height: 50,
      width: 50,
      animations: { enabled: true },
      foreColor: "var(--text-primary)",
      fontFamily: "Nunito",
      zoom: { allowMouseWheelZoom: true },
      toolbar: { show: false },
    },
    plotOptions: {
      pie: {
        offsetX: -75,
        donut: { labels: { name: {}, value: {}, total: {} } },
      },
    },
    fill: {
      colors: ["#5d8f4e", "#4e6f39", "#b2e29f", "#3c9528"],
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
        </div>

        {/* Columna derecha: gráfico, datos y consejo */}
        <div className="columna-derecha">
          <h4 className="graph-title">Consumo Dispositivos</h4>
          <ApexCharts 
            key={JSON.stringify(devices)} // Cambia esta key cuando los dispositivos cambien
            options={options} 
            series={series} 
            type="pie" 
            height={300}
          />

          {selectedDevice && (
            <div className="mini-modal-cost">
              <h5>Detalle de Consumo</h5>
              <p><strong>Dispositivo:</strong> {selectedDevice.dispositivo_nombre}</p>
              <p><strong>Costo estimado:</strong> ${selectedDevice.costoActual.toFixed(2)} MXN</p>
              <button className="ver-detalles-btn">Ver más</button>
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
