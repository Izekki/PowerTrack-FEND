import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import HistorialLineChart from "../components/ConsumoComponets/HistorialLineChart";
import "../styles/HomePage.css";
import { useNavigate } from "react-router-dom";

const DOMAIN_URL = import.meta.env.VITE_BACKEND_URL;

const HomePage = () => {
  const { userId, name } = useAuth();
  const [summaryData, setSummaryData] = useState({
    consumoDia: 0,
    costoMes: 0,
    alertasDia: 0
  });
  const [chartData, setChartData] = useState([]);
  const [deviceList, setDeviceList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      // 1. Obtener resumen de dispositivos para las tarjetas y lista
      fetch(`${DOMAIN_URL}/electrical_analysis/consumoPorDispositivosGrupos/${userId}`)
        .then(res => res.json())
        .then(data => {
            // Calcular consumo del día (sumatoria simple para ejemplo, idealmente viene del backend)
            const consumoTotal = data.resumenDispositivos.reduce((acc, curr) => acc + (curr.consumoActualKWh || 0), 0);
            
            // Simulación de costo mensual y alertas (deberías tener endpoints específicos o calcularlos)
            setSummaryData(prev => ({
                ...prev,
                consumoDia: consumoTotal.toFixed(2),
                costoMes: (consumoTotal * 30 * 1.5).toFixed(2), // Ejemplo de cálculo
            }));

            // Ordenar dispositivos por consumo para la lista
            const sortedDevices = data.resumenDispositivos
                .sort((a, b) => b.consumoActualKWh - a.consumoActualKWh)
                .slice(0, 3); // Top 3
            
            setDeviceList(sortedDevices);
        });

      // 2. Obtener datos para la gráfica (reutilizando historial)
      fetch(`${DOMAIN_URL}/electrical_analysis/historial_detallado/${userId}`)
        .then(res => res.json())
        .then(data => {
            // Buscar datos del día o semana para la gráfica de home
            const todayData = data.find(d => d.rango === 'dia') || data[0];
            if(todayData && todayData.detalles) {
                setChartData(todayData.detalles);
            }
        });
        
      // 3. Obtener alertas del día
       fetch(`${DOMAIN_URL}/alertas/usuario/${userId}?limit=100&filtro=todos`)
        .then(res => res.json())
        .then(data => {
            // Filtrar alertas de hoy
            const hoy = new Date().toLocaleDateString();
            const alertasHoy = data.filter(a => new Date(a.fecha).toLocaleDateString() === hoy);
            setSummaryData(prev => ({ ...prev, alertasDia: alertasHoy.length }));
        });
    }
  }, [userId]);

  return (
    <div className="home-dashboard">
      <div className="dashboard-header">
        <h1>Monitoreo de consumo eléctrico</h1>
        <button className="profile-btn-header" onClick={() => navigate('/miperfil')}>
            Perfil
        </button>
      </div>

      {/* Tarjetas Superiores */}
      <div className="kpi-container">
        <div className="kpi-card">
          <h3>Consumo del día</h3>
          <div className="kpi-value">{summaryData.consumoDia} <small>KWh</small></div>
          <span className="kpi-trend negative">▲ 5% vs ayer</span>
        </div>

        <div className="kpi-card">
          <h3>Costo del mes</h3>
          <div className="kpi-value">${summaryData.costoMes} <small>MXN</small></div>
          <span className="kpi-status ok">✓ Dentro del rango</span>
        </div>

        <div className="kpi-card">
          <h3>Alertas del día</h3>
          <div className="kpi-value alert-text">{summaryData.alertasDia}</div>
          <span className="kpi-sub">⚠️ Requieren atención</span>
        </div>
      </div>

      {/* Gráfica Principal */}
      <div className="chart-section">
        <h3>Historial de consumo (Últimas 24h)</h3>
        <div className="home-chart-container">
            {chartData.length > 0 ? (
                <HistorialLineChart detalles={chartData} />
            ) : (
                <p>Cargando datos del gráfico...</p>
            )}
        </div>
      </div>

      {/* Lista de Dispositivos (Progreso) */}
      <div className="devices-summary-section">
        <h3>Dispositivos (Top Consumo)</h3>
        <div className="devices-progress-list">
            {deviceList.map(dev => (
                <div key={dev.dispositivo_id} className="device-progress-item">
                    <span className="dev-name">{dev.nombre}</span>
                    <div className="progress-bar-bg">
                        <div 
                            className="progress-bar-fill" 
                            style={{width: `${Math.min((dev.consumoActualKWh / 5) * 100, 100)}%`}} // Ejemplo de escala
                        ></div>
                    </div>
                    <span className="dev-val">{dev.consumoActualKWh} kWh</span>
                </div>
            ))}
            {deviceList.length === 0 && <p>No hay dispositivos registrados</p>}
        </div>
      </div>
    </div>
  );
};

export default HomePage;