import React from "react";
import "../styles/DeviceCard.css";
import noImageCard from '../assets/noimage-card.svg';

const DeviceCard = ({ nombre, ubicacion, id_grupo }) => {
  const status = "online";
  const image = { noImageCard };

  return (
    <div className={`device-card ${id_grupo ? 'group-card' : ''}`}>
      <div className="device-img">
        <img src={image} alt="" />
      </div>
      <p className="device-name">{nombre}</p>
      <p className="device-location">{ubicacion}</p>
      <p className="device-status">
        {status === "online" ? "🟢 En línea" : "🔴 Desconectado"}
      </p>
      <div className="actions">
        <button className="edit-btn">Editar</button>
        <button className="delete-btn">Eliminar</button>
      </div>
    </div>
  );
};

export default DeviceCard;
