import React from "react";

const AlertsConfigCard = ({
  loading,
  configuraciones,
  handleMinChange,
  handleMaxChange,
  activeThreshold,
}) => {
  return (
    <>
      {loading ? (
        <p className="alert-config-state">Cargando configuraciones...</p>
      ) : configuraciones.length === 0 ? (
        <p className="alert-config-state">No hay dispositivos configurados.</p>
      ) : (
        <div className="alert-config-grid">
          {configuraciones.map((conf) => {
            const isMinActive =
              activeThreshold?.id === conf.dispositivo_id &&
              activeThreshold?.field === "min";
            const isMaxActive =
              activeThreshold?.id === conf.dispositivo_id &&
              activeThreshold?.field === "max";

            return (
              <div key={conf.configuracion_id} className="alert-config-card">
                <div className="alert-header">
                  <strong>{conf.dispositivo_nombre}</strong> -{" "}
                  <small>{conf.tipo_dispositivo}</small>
                </div>

                <div className="alert-slider-group">
                  <label
                    className={`alert-slider-label ${
                      isMinActive ? "is-active" : ""
                    }`}
                  >
                    Minimo ({(conf.minimo / 1000).toFixed(2)} kW)
                    <input
                      className={`alert-slider ${
                        isMinActive ? "is-active" : ""
                      }`}
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

                  <label
                    className={`alert-slider-label ${
                      isMaxActive ? "is-active" : ""
                    }`}
                  >
                    Maximo ({(conf.maximo / 1000).toFixed(2)} kW)
                    <input
                      className={`alert-slider ${
                        isMaxActive ? "is-active" : ""
                      }`}
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
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default AlertsConfigCard;
