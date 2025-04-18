import React from "react";
import DeviceCard from "./DeviceCard";
import GroupCard from "./GroupCard";

import "../styles/DeviceList.css";

const DeviceList = ({
  searchQuery,
  devices,
  groups, // Asegúrate de pasar los grupos también como prop
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
    (device.dispositivo_nombre &&
      device.dispositivo_nombre.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (device.grupo_nombre &&
      device.grupo_nombre.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const groupedDevices = {};
  const devicesWithoutGroup = [];

  // Agrupar dispositivos o agregar a la lista de dispositivos sin grupo
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

  // Filtrar grupos por búsqueda (aunque tengan dispositivos o no)
  const filteredGroups = Array.isArray(groups) ?
   groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
   ) : [];

  // Asegurarnos de que todos los grupos estén presentes en la lista de grupos, incluso los vacíos
  const allGroupsWithDevices = filteredGroups.map((group) => ({
    ...group,
    devices: groupedDevices[group.name] || [], // Si no hay dispositivos, asignar un array vacío
  }));

  return (
    <div className="device-list-container">
      {/* Columna de Grupos */}
      <div className="group-column">
        <h3 className="column-title">Grupos</h3>
        {allGroupsWithDevices.length > 0 ? (
          allGroupsWithDevices.map((group) => (
            <GroupCard
              key={group.id}
              groupName={group.name}
              devices={group.devices}
              onEditDevice={onEditDevice}
              onEditGroup={() => onEditGroup(group.name)}
              onDeleteGroup={() => onDeleteGroup(group.name)}
              onDeleteDevice={onDeleteDevice}
              onDeviceUpdate={onDeviceUpdate}
            />
          ))
        ) : (
          <p className="no-results-message">No se encontraron grupos.</p>
        )}
      </div>

      {/* Columna de Dispositivos sin grupo */}
      <div className="device-column">
        <h3 className="column-title">Dispositivos</h3>
        {devicesWithoutGroup.length > 0 ? (
          devicesWithoutGroup.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              onDeviceUpdate={onDeviceUpdate}
              onEdit={onEditDevice}
              onDelete={onDeleteDevice}
            />
          ))
        ) : (
          <p className="no-results-message">No se encontraron dispositivos.</p>
        )}
      </div>
    </div>
  );
};

export default DeviceList;
