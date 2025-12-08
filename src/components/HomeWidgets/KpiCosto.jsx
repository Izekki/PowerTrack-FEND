import React from 'react';

const KpiCosto = ({ data, loading }) => {
  return (
    <div className="kpi-card">
      <h3>Costo estimado mes</h3>
      <div className="kpi-value">
        ${loading ? "..." : data?.costoMes} <small>MXN</small>
      </div>
      <span className="kpi-status ok">Proyección del mes</span>
    </div>
  );
};

export default KpiCosto;