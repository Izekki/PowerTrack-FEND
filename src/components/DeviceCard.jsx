import React from "react";
import "../styles/DeviceCard.css";
import noImageCard from "../assets/devices-icons/noimage-card.svg";

// Carga dinámica de imágenes
const images = import.meta.glob("../assets/devices-icons/*.png", {
  eager: true,
  import: "default",
});

const DeviceCard = ({ device, onDelete, onEdit }) => {
  if (!device) return null;

  const {
    dispositivo_nombre,
    ubicacion,
    id_grupo,
    id_tipo_dispositivo,
  } = device;

  const status = "online";

  const imagePath = `../assets/devices-icons/${id_tipo_dispositivo}.png`;
  const image =
    images[imagePath] || images["../assets/devices-icons/noimage-card.svg"] || noImageCard;

  return (
    <div className={`device-card ${id_grupo ? "group-card" : ""}`}>
      <div className="device-img">
        <img src={image} alt={`Tipo ${id_tipo_dispositivo}`} />
      </div>
      <p className="device-name">{dispositivo_nombre}</p>
      <p className="device-location">{ubicacion}</p>
      <p className="device-status" data-status={status}>
        {status === "online" ? "En línea" : "Desconectado"}
      </p>
      <div className="actions">
        <button className="edit-btn" onClick={() => onEdit(device)}>
          Editar
        </button>
        <button className="delete-btn" onClick={onDelete}>
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default DeviceCard;
