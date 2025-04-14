import React from "react";
import "../styles/GroupCard.css";
import DeviceCard from "./DeviceCard";

const GroupCard = ({ groupName, devices, onEdit, onDeviceUpdate }) => {
  return (
    <div className="group-card">
      <h3 className="grupo-card-title">{groupName}</h3> {/* Título del grupo */}
      <div className="devices-list">
        {devices.map((device) => (
          <DeviceCard
            key={device.id}
            device={device}
            onEdit={() => onEdit(device)}
            onDeviceUpdate={onDeviceUpdate}
          />
        ))}
      </div>
    </div>
  );
};

export default GroupCard;


