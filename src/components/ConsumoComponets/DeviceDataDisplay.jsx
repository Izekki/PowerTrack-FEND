import React from 'react';
import "../../styles/ConsumeComponentesCss/DeviceDataDisplay.css"


const DeviceDataDisplay = ({ devices, activeButton }) => {
  return (
    <div className="device-data-display">
      <div className="datos-consumo">
        {devices.map(device => (
          <span
            key={device.id}
            className={`datos-consumo-span ${activeButton === device.id ? 'active' : ''}`}
          >
            {device.dispositivo_nombre} = {device.consumoActual ?? 0} kWh
          </span>
        ))}
      </div>
    </div>
  );
};

export default DeviceDataDisplay;
