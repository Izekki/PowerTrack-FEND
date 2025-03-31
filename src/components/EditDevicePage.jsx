import React from "react";
import "../styles/EditDevicePage.css";
import EditDeviceCard from "./EditDeviceCard";
import EditDeviceImageCard from "./EditDeviceImageCard";

const EditDevicePage = ({ isOpen, onDeviceUpdated, device }) => {
  if (!isOpen || !device) return null;

  return (
    <div className="edit-device-container">
      <h2 className="title-Editar-Dispositivo">Editar Dispositivo</h2>
        <div className="edit-device-page">
          <EditDeviceCard device={device} onDeviceUpdated={onDeviceUpdated} />
        <div className="edit-device-image">
          <EditDeviceImageCard device={device} onDeviceUpdated={onDeviceUpdated} />
        </div>
      </div>
     
    </div>
  );
};

export default EditDevicePage;
