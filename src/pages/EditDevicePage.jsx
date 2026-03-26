import React from "react";
import "../styles/EditDevicePage.css";
import EditDeviceCard from "../components/DeviceComponents/EditDeviceCard"
import EditDeviceImageCard from "../components/DeviceComponents/EditDeviceImageCard";
import BackButton from "../components/CommonComponents/BackButton";
import Breadcrumb from "../components/CommonComponents/Breadcrumb";

const EditDevicePage = ({ onDeviceUpdated, device, onClose }) => {
  if (!device) return null;

  const breadcrumbItems = [
    { label: "Dispositivos", onClick: onClose },
    { label: "Editar Dispositivo", active: true }
  ];

  return (
    <div className="edit-device-container">
      <div className="breadcrumb-topbar">
        <Breadcrumb items={breadcrumbItems} />
        <div className="breadcrumb-actions">
          <BackButton className="btn-close-edit" onClick={onClose} />
        </div>
      </div>
      <div className="header-edit-device-container">
        <h2 className="title-Editar-Dispositivo">Editar Dispositivo</h2>
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
