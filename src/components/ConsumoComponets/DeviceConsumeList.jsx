import React from "react";
import "../../styles/ConsumeComponentesCss/DeviceConsumeList.css";


const DeviceConsumeList = ({
  devices,
  groups,
  activeGroupButton,
  activeDeviceButton,
  onDeviceClick,
  onGroupClick,
  expandedGroups
}) => {
  return (
    <div className="dispositivos-lista">

      {groups.length > 0 && (
        <>
          <h4 className="lista">Grupos</h4>
          {groups.map(group => (
            <div key={`group-container-${group.id}`}>
              <button
                key={`group-${group.id}`}
                className={`grupo-btn ${activeGroupButton === `group-${group.id}` ? "active" : ""}`}
                onClick={() => onGroupClick(`group-${group.id}`, group.id)}
              >
                {group.nombre}
              </button>

              {expandedGroups.includes(group.id) && (
                <div className="dispositivos-grupo">
                  {devices
                    .filter(device => device.grupo_id === group.id)
                    .map(device => (
                      <button
                        key={device.id}
                        className={`dispositivo-btn ${activeDeviceButton === device.id ? "active" : ""}`}
                        onClick={() => onDeviceClick(device.id, group.id)}
                      >
                        {device.dispositivo_nombre}
                      </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </>
      )}

      {/* Dispositivos sin grupo */}
      {devices.filter(d => d.grupo_id === null).length > 0 && (
        <>
          <h4 className="lista">Dispositivos sin grupo</h4>
          {devices
            .filter(d => d.grupo_id === null)
            .map(device => (
              <button
                key={device.id}
                className={`dispositivo-btn ${activeDeviceButton === device.id ? "active" : ""}`}
                onClick={() => onDeviceClick(device.id, null)}
              >
                {device.dispositivo_nombre}
              </button>
          ))}
        </>
      )}

      {devices.length === 0 && <span>No hay dispositivos registrados</span>}
    </div>
  );
};

export default DeviceConsumeList;
