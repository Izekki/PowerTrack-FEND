import React from 'react';

const TopDevicesList = ({ deviceList, loading }) => {
  return (
    <div className="devices-summary-section">
      <h3>Dispositivos (Mayor Consumo)</h3>
      <div className="devices-progress-list">
          {!loading && deviceList.map((dev, index) => {
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
  );
};

export default TopDevicesList;