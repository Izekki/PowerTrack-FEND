import React from "react";
import "../styles/AddButton.css";

const AddDeviceButton = ({ onClick }) => {
  return (
    <button className="add-button add-device-button" onClick={onClick}>
        +
    </button>
  );
};

export default AddDeviceButton;
