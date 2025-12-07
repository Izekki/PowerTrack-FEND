import React from "react";

const AlertsConfigCard = ({
  loading,
  configuraciones,
  handleMinChange,
  handleMaxChange,
}) => {
  return (
    <div className="configurationCard configurationCard-alerts">
      <h3 className="configurationCard-title">Alertas</h3>

      {loading ? (
        <p>Cargando configuraciones...</p>
      ) : configuraciones.length === 0 ? (
        <p>No hay dispositivos configurados.</p>
      ) : (
        <ul className="alerts-list">
          {configuraciones.map((conf) => (
            <li key={conf.configuracion_id} className="alert-item">
              <div className="alert-header">
                <strong>{conf.dispositivo_nombre}</strong> -{" "}
                <small>{conf.tipo_dispositivo}</small>
              </div>

              <div className="alert-slider-group">
                <label className="alert-slider-label">
                  Mínimo ({(conf.minimo / 1000).toFixed(2)} kW)
                  <input
                    type="range"
                    min={parseFloat(conf.consumo_minimo_w)}
                    max={parseFloat(conf.consumo_maximo_w)}
                    step="1"
                    value={conf.minimo}
                    onChange={(e) =>
                      handleMinChange(conf.dispositivo_id, e.target.value)
                    }
                  />
                </label>

                <label className="alert-slider-label">
                  Máximo ({(conf.maximo / 1000).toFixed(2)} kW)
                  <input
                    type="range"
                    min={parseFloat(conf.consumo_minimo_w)}
                    max={parseFloat(conf.consumo_maximo_w)}
                    step="1"
                    value={conf.maximo}
                    onChange={(e) =>
                      handleMaxChange(conf.dispositivo_id, e.target.value)
                    }
                  />
                </label>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AlertsConfigCard;
