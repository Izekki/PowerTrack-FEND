import React from "react";
import "../styles/AddButton.css";

const AddGroupButton = ({ onClick }) => {
  return (
    <button className="add-button add-group-button" onClick={onClick}>
      +
    </button>
  );
};

export default AddGroupButton;
