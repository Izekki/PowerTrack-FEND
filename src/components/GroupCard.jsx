import React from "react";
import "../styles/GroupCard.css";
import DeviceCard from "./DeviceCard";

const GroupCard = ({ groupName, devices }) => {
  return (
    <div className="group-card">
      <h3 className="grupo-card-title">{groupName}</h3> {/* Título del grupo */}
      <div className="devices-list">
        {devices.map((device) => (
          <DeviceCard 
            key={device.id} 
            nombre={device.nombre} 
            ubicacion={device.ubicacion} 
            id_grupo={device.id_grupo} 
          />
        ))}
      </div>
    </div>
  );
};

export default GroupCard;
