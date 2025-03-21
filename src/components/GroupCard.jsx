/*import React from "react";
import "../styles/GroupCard.css";
import DeviceCard from "./DeviceCard";

const GroupCard = ({ groupName, devices, onEdit, onDelete }) => {
  return (
    <div className="group-card">
      <h3 className="grupo-card-title">{groupName}</h3> {/* Título del grupo }
      <div className="devices-list">
        {devices.map((device) => (
          <DeviceCard
            key={device.id}
            dispositivo_nombre={device.dispositivo_nombre} 
            ubicacion={device.ubicacion} 
            id_grupo={device.id_grupo}
            onEdit={() => onEdit(device.id)}
            onDelete={() => onDelete(device.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default GroupCard;*/

import React from "react";
import "../styles/GroupCard.css";
import DeviceCard from "./DeviceCard";

const GroupCard = ({ groupName, devices, onEdit = () => {}, onDelete = () => {} }) => {
  return (
    <div className="group-card">
      <h3 className="grupo-card-title">{groupName}</h3> {/* Título del grupo */}
      <div className="devices-list">
        {devices.map((device) => (
          <DeviceCard
            key={device.id}
            dispositivo_nombre={device.dispositivo_nombre} 
            ubicacion={device.ubicacion} 
            id_grupo={device.id_grupo}
            onEdit={() => onEdit(device.id)}
            onDelete={() => onDelete(device.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default GroupCard;

