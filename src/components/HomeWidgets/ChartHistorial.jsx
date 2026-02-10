import React from 'react';
import HistorialLineChart from "../ConsumoComponets/HistorialLineChart";
import '../../styles/ChartHistorial.css';

const ChartHistorial = ({ chartData, loading, timeRange, setTimeRange }) => {
  return (
    <div className="chart-section">
      <div className="chart-header">
        <h3>Gráfica Histórica</h3>
        <div className="time-selector-inline">
          {[1, 8, 12, 24].map(hours => (
            <button 
              key={hours} 
              className={`time-btn-inline ${timeRange === hours ? 'active' : ''}`} 
              onClick={() => setTimeRange(hours)}
            >
              {hours}h
            </button>
          ))}
        </div>
      </div>
      <div className="home-chart-container">
          {!loading && chartData?.length > 0 ? (
              <HistorialLineChart detalles={chartData} />
          ) : (
              <p className="no-data-msg">
                  {loading ? "Cargando gráfica..." : "No hay datos recientes disponibles."}
              </p>
          )}
      </div>
    </div>
  );
};

export default ChartHistorial;