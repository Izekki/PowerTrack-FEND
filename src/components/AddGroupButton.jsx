import React from "react";
import "../styles/AddButton.css";
import botonMasIcon from "../assets/sidebar-icons/boton-mas.png";

const AddGroupButton = ({ onClick }) => {
  return (
    <button className="add-button add-group-button" onClick={onClick}>
      <img src={botonMasIcon} alt="Agregar" className="add-button-icon" />
    </button>
  );
};

export default AddGroupButton;
