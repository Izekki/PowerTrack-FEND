import React from 'react';
import "../../styles/ConsumeComponentesCss/DeviceDataDisplay.css"


const DeviceDataDisplay = ({ groups, devices, activeGroupButton, activeDeviceButton, displayMode }) => {
  const isCostMode = displayMode === "mxn";
  const formatValue = (value) => {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
      return isCostMode ? "$0.00" : "0.00 kWh";
    }
    const formatted = numericValue.toFixed(2);
    return isCostMode ? `$${formatted} MXN` : `${formatted} kWh`;
  };

  return (
    <div className="device-data-display">
      <div className="datos-consumo">
        {groups.map(group => (
          <span
            key={`group-${group.id}`}
            className={`datos-grupo-consumo-span ${activeGroupButton === `group-${group.id}` ? 'active' : ''}`}
          >
            {group.nombre} = {formatValue(isCostMode ? group.costoActual : group.consumoActual)}
          </span>
        ))}
        {devices.map(device => (
          <span
            key={device.id}
            className={`datos-consumo-span ${activeDeviceButton === device.id ? 'active' : ''}`}
          >
            {device.dispositivo_nombre} = {formatValue(isCostMode ? device.costoActual : device.consumoActual)}
          </span>
        ))}
      </div>
    </div>
  );
};

export default DeviceDataDisplay;
