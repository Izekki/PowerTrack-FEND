import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import HistorialLineChart from "../components/ConsumoComponets/HistorialLineChart";
import "../styles/HomePage.css";
import { useNavigate } from "react-router-dom";

const DOMAIN_URL = import.meta.env.VITE_BACKEND_URL;

const HomePage = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();

  // Estados para almacenar los datos de la API
  const [summaryData, setSummaryData] = useState({
    consumoDia: 0,
    costoMes: 0,
    alertasDia: 0
  });
  const [chartData, setChartData] = useState([]);
  const [deviceList, setDeviceList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        //Realizamos las 3 peticiones  
        const [resConsumo, resHistorial, resAlertas] = await Promise.all([
          fetch(`${DOMAIN_URL}/electrical_analysis/consumoPorDispositivosGrupos/${userId}`),
          fetch(`${DOMAIN_URL}/electrical_analysis/historial_detallado/${userId}`),
          fetch(`${DOMAIN_URL}/alertas/usuario/${userId}?limit=100&filtro=todos`)
        ]);

        const dataConsumo = await resConsumo.json();
        const dataHistorial = await resHistorial.json();
        const dataAlertas = await resAlertas.json();


        // A) Resumen de Dispositivos
        const dispositivos = Array.isArray(dataConsumo.resumenDispositivos) 
          ? dataConsumo.resumenDispositivos 
          : [];

        // Sumar el consumo de todos los dispositivos para el KPI "Consumo del día"
        const consumoTotalDia = dispositivos.reduce((acc, curr) => acc + (Number(curr.consumoActualKWh) || 0), 0);
        
        // Estimación simple de costo mensual
        // Consumo Dia * 30 días * $1.5 tarifa
        const costoMensualEstimado = consumoTotalDia * 30 * 1.5;

        // Ordenar dispositivos por consumo y tomamos el Top 3
        const topDevices = [...dispositivos]
          .sort((a, b) => (Number(b.consumoActualKWh) || 0) - (Number(a.consumoActualKWh) || 0))
          .slice(0, 3);

        //Historial para la Gráfica
        let historialDia = [];
        if (Array.isArray(dataHistorial)) {
            const diaData = dataHistorial.find(d => d.rango === 'dia');
            if (diaData && diaData.detalles) {
                historialDia = diaData.detalles;
            }
        }

        //Alertas del día
        const hoy = new Date().toLocaleDateString('es-MX'); // Ajusta locale según tu necesidad
        const alertasHoy = Array.isArray(dataAlertas) 
            ? dataAlertas.filter(a => new Date(a.fecha).toLocaleDateString('es-MX') === hoy).length
            : 0;

        setSummaryData({
            consumoDia: consumoTotalDia.toFixed(2),
            costoMes: costoMensualEstimado.toFixed(2),
            alertasDia: alertasHoy
        });

        setDeviceList(topDevices);
        setChartData(historialDia);

      } catch (error) {
        console.error("Error cargando dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

  }, [userId]);

  return (
    <div className="home-dashboard">
      <div className="dashboard-header">
        <h1>Monitoreo de consumo eléctrico</h1>
        <button className="profile-btn-header" onClick={() => navigate('/miperfil')}>
            Perfil
        </button>
      </div>

      {/* Tarjetas Superiores (KPIs) */}
      <div className="kpi-container">
        <div className="kpi-card">
          <h3>Consumo estimado hoy</h3>
          <div className="kpi-value">
             {loading ? "..." : summaryData.consumoDia} <small>kWh</small>
          </div>
          <span className="kpi-trend neutral">Actualizado en tiempo real</span>
        </div>

        <div className="kpi-card">
          <h3>Costo estimado mes</h3>
          <div className="kpi-value">
            ${loading ? "..." : summaryData.costoMes} <small>MXN</small>
          </div>
          <span className="kpi-status ok">Proyección del mes</span>
        </div>

        <div className="kpi-card">
          <h3>Alertas de hoy</h3>
          <div className={`kpi-value ${summaryData.alertasDia > 0 ? "alert-text" : ""}`}>
            {loading ? "..." : summaryData.alertasDia}
          </div>
          <span className="kpi-sub">
            {summaryData.alertasDia > 0 ? "⚠️ Requieren atención" : "✓ Sistema estable"}
          </span>
        </div>
      </div>

      {/* Gráfica Principal */}
      <div className="chart-section">
        <h3>Historial de consumo (Últimas 24h)</h3>
        <div className="home-chart-container">
            {!loading && chartData.length > 0 ? (
                <HistorialLineChart detalles={chartData} />
            ) : (
                <p className="no-data-msg">
                    {loading ? "Cargando gráfica..." : "No hay datos recientes disponibles."}
                </p>
            )}
        </div>
      </div>

      {/* Lista de Dispositivos (Top Consumo) */}
      <div className="devices-summary-section">
        <h3>Dispositivos (Mayor Consumo)</h3>
        <div className="devices-progress-list">
            {!loading && deviceList.map((dev, index) => {
                // Calcular porcentaje relativo al dispositivo que más consume (el primero de la lista)
                const maxConsumo = deviceList[0]?.consumoActualKWh || 1;
                const porcentaje = (dev.consumoActualKWh / maxConsumo) * 100;

                return (
                  <div key={dev.dispositivo_id || index} className="device-progress-item">
                      <span className="dev-name">{dev.nombre || dev.dispositivo_nombre}</span>
                      <div className="progress-bar-bg">
                          <div 
                              className="progress-bar-fill" 
                              style={{ width: `${porcentaje}%` }} 
                          ></div>
                      </div>
                      <span className="dev-val">{Number(dev.consumoActualKWh).toFixed(2)} kWh</span>
                  </div>
                );
            })}
            
            {!loading && deviceList.length === 0 && (
                <p className="no-results-message">No se encontraron dispositivos activos.</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;