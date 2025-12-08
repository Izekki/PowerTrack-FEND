import React from 'react';

const KpiAlertas = ({ data, loading }) => {
  return (
    <div className="kpi-card">
      <h3>Alertas de hoy</h3>
      <div className={`kpi-value ${data?.alertasDia > 0 ? "alert-text" : ""}`}>
        {loading ? "..." : data?.alertasDia}
      </div>
      <span className="kpi-sub">
        {data?.alertasDia > 0 ? "⚠️ Requieren atención" : "✓ Sistema estable"}
      </span>
    </div>
  );
};

export default KpiAlertas;