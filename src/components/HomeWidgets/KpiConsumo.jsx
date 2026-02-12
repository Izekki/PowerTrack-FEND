import React from 'react';

const KpiConsumo = ({ data, trends, loading }) => {
  const isUp = trends?.consumoSign === 'negative'; // Si subió el consumo es malo
  const symbol = isUp ? '▲' : '▼';
  
  return (
    <div className="kpi-card">
      <h3>Consumo estimado</h3>
      <div className="kpi-value">
         {loading ? "..." : data?.consumoDia} <small>kWh</small>
      </div>
      
      {!loading && (
        <span className={`kpi-trend ${trends?.consumoSign}`}>
           {symbol} {trends?.consumoTrend}% vs ayer
        </span>
      )}
    </div>
  );
};

export default KpiConsumo;