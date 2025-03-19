import React from "react";
import "../styles/AddButton.css";

const AddGroupButton = ({ onClick }) => {
  return (
    <button className="add-button add-group-button" onClick={onClick}>
      Agregar Grupo
    </button>
  );
};

export default AddGroupButton;
