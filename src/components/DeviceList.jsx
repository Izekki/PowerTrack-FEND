import React from "react";
import DeviceCard from "./DeviceCard";
import GroupCard from "./GroupCard";

import "../styles/DeviceList.css";

const DeviceList = ({
   searchQuery,
    devices,
    loading,
    onDeviceUpdate,
    onEditDevice,
    onEditGroup,
    onDeleteGroup,
    onDeleteDevice,
   }) => {
  if (loading) {
    return <p>Cargando dispositivos...</p>;
  }

  // Filtrar dispositivos con verificación de valores no undefined
  const filteredDevices = devices.filter((device) =>
    (device.dispositivo_nombre && device.dispositivo_nombre.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (device.grupo_nombre && device.grupo_nombre.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const groupedDevices = {};
  const devicesWithoutGroup = [];

  filteredDevices.forEach((device) => {
    if (device.grupo_nombre) {
      if (!groupedDevices[device.grupo_nombre]) {
        groupedDevices[device.grupo_nombre] = [];
      }
      groupedDevices[device.grupo_nombre].push(device);
    } else {
      devicesWithoutGroup.push(device);
    }
  });

  const filteredGroups = Object.entries(groupedDevices)
    .filter(([groupName, devices]) =>
      groupName.toLowerCase().includes(searchQuery.toLowerCase()) || devices.length > 0
    )
    .reduce((acc, [groupName, devices]) => {
      acc[groupName] = devices;
      return acc;
    }, {});

  return (
    <div className="device-list-container">
      <div className="group-column">
      <h3 className="column-title">Grupos</h3>
        {Object.keys(filteredGroups).map((groupName) => (
          <GroupCard 
            key={groupName}
            groupName={groupName}
            devices={filteredGroups[groupName]}
            onEditDevice={onEditDevice}
            onEditGroup={() => onEditGroup(groupName)}
            onDeleteGroup={() => onDeleteGroup(groupName)}
            onDeleteDevice={onDeleteDevice}
            onDeviceUpdate={onDeviceUpdate} 
          />
        ))}
      </div>
      <div className="device-column">
        <h3 className="column-title">Dispositivos</h3>
        {devicesWithoutGroup.map((device) => (
          <DeviceCard 
            key={device.id} 
            device={device} 
            onDeviceUpdate={onDeviceUpdate}
            onEdit={onEditDevice}
            onDelete={onDeleteDevice}
          />
        ))}
      </div>
    </div>
  );
};

export default DeviceList;