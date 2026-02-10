import React from "react";
import "../styles/AddButton.css";
import botonMasIcon from "../assets/sidebar-icons/boton-mas.png";

const AddGroupButton = ({ onClick, label, className }) => {
  const buttonLabel = label || "Agregar grupo";
  const buttonClassName = ["add-button", "add-group-button", className]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={buttonClassName}
      onClick={onClick}
      title={buttonLabel}
      aria-label={buttonLabel}
    >
      <img src={botonMasIcon} alt="" className="add-button-icon" />
      {label && <span className="add-button-label">{label}</span>}
    </button>
  );
};

export default AddGroupButton;
