/*import React from "react";
import "../styles/DeviceCard.css";
import noImageCard from "../assets/noimage-card.svg";

const DeviceCard = ({ dispositivo_nombre, ubicacion, id_grupo, onEdit, onDelete }) => {
  const status = "online"; // Debería venir como prop en el futuro
  const image = noImageCard; 

  return (
    <div className={`device-card ${id_grupo ? "group-card" : ""}`}>
      <div className="device-img">
        <img src={image} alt="Imagen del dispositivo" />
      </div>
      <p className="device-name">{dispositivo_nombre}</p>
      <p className="device-location">{ubicacion}</p>
      <p className="device-status" data-status={status}>
        {status === "online" ? "En línea" : "Desconectado"}
      </p>
      <div className="actions">
        <button className="edit-btn" onClick={onEdit}>Editar</button>
        <button className="delete-btn" onClick={onDelete}>Eliminar</button>
      </div>
    </div>
  );
};

export default DeviceCard;*/

import React from "react";
import { useState } from "react";
import "../styles/DeviceCard.css";
import noImageCard from "../assets/noimage-card.svg";
import EditDeviceModal from "./EditDeviceModal";

const DeviceCard = ({ name, ubicacion, id_usuario, id_grupo, onEdit, onDelete }) => {
  const status = "online"; 
  const image = noImageCard;
  const [isDeviceModalOpen, setDeviceIsModalOpen] = useState(false);

  return (
    <>
    <div className={`device-card ${id_grupo ? "group-card" : ""}`}>
      <div className="device-img">
        <img src={image} alt="Imagen del dispositivo" />
      </div>
      <p className="device-name">{name}</p>
      <p className="device-location">{ubicacion}</p>
      <p className="device-status" data-status={status}>
        {status === "online" ? "En línea" : "Desconectado"}
      </p>
      <div className="actions">
        <button className="edit-btn" onClick={() => setDeviceIsModalOpen(true)}>
          Editar
        </button>
        <button className="delete-btn" onClick={onDelete}>Eliminar</button>
      </div>
    </div>
    <EditDeviceModal 
      isOpen={isDeviceModalOpen} 
      onClose={() => setDeviceIsModalOpen(false)} 
      onUpdate={onEdit} 
      editingDevice={{ name, ubicacion, id_usuario,  id_grupo }} // ✅ PASAR EL OBJETO COMPLETO
    />
    </>
  );
};

export default DeviceCard;
