import React from "react";
import "../../styles/ConsumeComponentesCss/DeviceConsumeList.css";


const DeviceConsumeList = ({ devices, activeButton, onDeviceClick }) => {
  return (
    <div className="dispositivos-lista">
      {devices.length > 0 ? (
        devices.map((device) => (
          <button
            key={device.id}
            className={`dispositivo-btn ${activeButton === device.id ? "active" : ""}`}
            onClick={() => onDeviceClick(device.id)}
          >
            {device.dispositivo_nombre}
          </button>
        ))
      ) : (
        <span>No hay dispositivos registrados</span>
      )}
    </div>
  );
};

export default DeviceConsumeList;
