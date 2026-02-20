import React from "react";
import "../../styles/DeviceComponentsCss/GroupCard.css";
import DeviceCard from "./DeviceCard";

const GroupCard = ({ groupName, devices, onEditDevice, onEditGroup, onDeviceUpdate, onDeleteGroup, onDeleteDevice }) => {
  return (
    <div className="group-card">
      <div className="grupo-card-header">
        <h3 className="grupo-card-title">{groupName}</h3>
        <div className="group-actions">
          <button 
            onClick={onEditGroup} 
            className="icon-btn"
            aria-label="Editar grupo"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path 
                fill="currentColor" 
                d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
              />
            </svg>
          </button>
          <button
            onClick={onDeleteGroup}
            className="icon-btn delete-btn-svg"
            aria-label="Eliminar grupo"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M21 5.5H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M16.0557 5.5L15.373 3.84571C14.9196 2.68387 14.6929 2.10296 14.2634 1.75105C14.0451 1.58 13.799 1.44652 13.5372 1.35608C13.0473 1.19998 12.492 1.19998 11.3813 1.19998H10.6187C9.508 1.19998 8.95265 1.19998 8.46275 1.35608C8.20093 1.44652 7.95489 1.58 7.73658 1.75105C7.30708 2.10296 7.08035 2.68387 6.62701 3.84571L5.94429 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M9.5 12L9.5 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M14.5 12L14.5 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
      <div className="devices-list">
        {devices.map((device) => (
          <DeviceCard
            key={device.id}
            device={device}
            onEdit={onEditDevice}
            onDelete={onDeleteDevice}
            onDeviceUpdate={onDeviceUpdate}
          />
        ))}
      </div>
    </div>
  );
};

export default GroupCard;