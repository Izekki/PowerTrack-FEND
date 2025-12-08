import React from 'react';
import HistorialLineChart from "../ConsumoComponets/HistorialLineChart";

const ChartHistorial = ({ chartData, loading }) => {
  return (
    <div className="chart-section">
      <h3>Historial de consumo (Últimas 24h)</h3>
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