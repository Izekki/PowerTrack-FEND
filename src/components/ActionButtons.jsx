import React from "react";
import AddDeviceButton from "./AddDeviceButton";
import AddGroupButton from "./AddGroupButton";

import "../styles/ActionButtons.css";

const ActionButtons = ({ onAddDevice, onAddGroup }) => {
  return (
    <div className="action-buttons-container">
      <AddDeviceButton onClick={onAddDevice} />
      <AddGroupButton onClick={onAddGroup} />
    </div>
  );
};

export default ActionButtons;
