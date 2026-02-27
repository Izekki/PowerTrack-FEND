import React from "react";
import "../../styles/DeviceComponentsCss/AddButton.css";
import botonMasIcon from "../../assets/sidebar-icons/boton-mas.png";

const AddDeviceButton = ({ onClick }) => {
  return (
    <button className="add-button add-device-button" onClick={onClick}>
        <img src={botonMasIcon} alt="Agregar" className="add-button-icon" />
    </button>
  );
};

export default AddDeviceButton;
