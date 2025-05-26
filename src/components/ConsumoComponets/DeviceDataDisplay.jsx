import React from 'react';
import "../../styles/ConsumeComponentesCss/DeviceDataDisplay.css"


const DeviceDataDisplay = ({ groups, devices, activeGroupButton, activeDeviceButton }) => {
  return (
    <div className="device-data-display">
      <div className="datos-consumo">
        {groups.map(group => (
          <span
            key={`group-${group.id}`}
            className={`datos-grupo-consumo-span ${activeGroupButton === `group-${group.id}` ? 'active' : ''}`}
          >
            {group.nombre} = {group.consumoActual ?? 0} kWh
          </span>
        ))}
        {devices.map(device => (
          <span
            key={device.id}
            className={`datos-consumo-span ${activeDeviceButton === device.id ? 'active' : ''}`}
          >
            {device.dispositivo_nombre} = {device.consumoActual ?? 0} kWh
          </span>
        ))}
      </div>
    </div>
  );
};

export default DeviceDataDisplay;
