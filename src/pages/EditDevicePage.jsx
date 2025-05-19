import React from "react";
import "../styles/EditDevicePage.css";
import EditDeviceCard from "../components/EditDeviceCard"
import EditDeviceImageCard from "../components/EditDeviceImageCard";

const EditDevicePage = ({ isOpen, onDeviceUpdated, device,onClose }) => {
  if (!device) return null;

  return (
    <div className="edit-device-container">
      <div className="header-edit-device-container">
        <h2 className="title-Editar-Dispositivo">Editar Dispositivo</h2>
        <div className="edit-device-actions">
        <button className="btn-close-edit" onClick={onClose}>Volver</button>
      </div>
      </div>
      <div className="container-edit-cards">
        <div className="edit-device-page">
          <EditDeviceCard device={device} onDeviceUpdated={onDeviceUpdated} />
        <div className="edit-device-image">
          <EditDeviceImageCard device={device} onDeviceUpdated={onDeviceUpdated} />
        </div>
      </div>
      </div>
    </div>
  );
};

export default EditDevicePage;
