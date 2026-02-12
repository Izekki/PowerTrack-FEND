import React from "react";
import DeviceCard from "./DeviceCard";
import GroupCard from "./GroupCard";
import AddDeviceButton from "./AddDeviceButton";
import AddGroupButton from "./AddGroupButton";

import "../styles/DeviceList.css";

const DeviceList = ({
  searchQuery,
  devices,
  groups,
  loading,
  viewMode = "devices",
  onDeviceUpdate,
  onEditDevice,
  onEditGroup,
  onDeleteGroup,
  onDeleteDevice,
  onAddGroup,
  onAddDevice,
}) => {
  if (loading) {
    return <p>Cargando dispositivos...</p>;
  }

  const normalizedQuery = (searchQuery || "").toLowerCase();

  // Filtrar dispositivos con verificación de valores no undefined
  const filteredDevices = devices.filter((device) => {
    const deviceName = device.dispositivo_nombre
      ? device.dispositivo_nombre.toLowerCase()
      : "";
    const groupName = device.grupo_nombre ? device.grupo_nombre.toLowerCase() : "";
    return deviceName.includes(normalizedQuery) || groupName.includes(normalizedQuery);
  });

  const groupedDevices = {};

  // Agrupar dispositivos por nombre de grupo
  filteredDevices.forEach((device) => {
    if (device.grupo_nombre) {
      if (!groupedDevices[device.grupo_nombre]) {
        groupedDevices[device.grupo_nombre] = [];
      }
      groupedDevices[device.grupo_nombre].push(device);
    }
  });

  // Filtrar grupos por búsqueda (aunque tengan dispositivos o no)
  const filteredGroups = Array.isArray(groups)
    ? groups.filter((group) =>
        group.name.toLowerCase().includes(normalizedQuery)
      )
    : [];

  // Asegurarnos de que todos los grupos estén presentes en la lista de grupos, incluso los vacíos
  const allGroupsWithDevices = filteredGroups.map((group) => ({
    ...group,
    devices: groupedDevices[group.name] || [], // Si no hay dispositivos, asignar un array vacío
  }));

  const hasGroups = Array.isArray(groups) && groups.length > 0;

  if (viewMode === "groups") {
    return (
      <div className="device-list-container single-view">
        <div className="group-column full-width">
          <div className="column-header">
            <div className="column-header-left">
              <h3 className="column-title">Grupos</h3>
              <AddGroupButton onClick={onAddGroup} />
            </div>
          </div>
          {hasGroups ? (
            allGroupsWithDevices.length > 0 ? (
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
            )
          ) : (
            <p className="no-results-message">No hay grupos registrados.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="device-list-container single-view">
      <div className="container-device-columns full-width">
        <div className="column-header">
          <div className="column-header-left">
            <h3 className="column-title">Dispositivos</h3>
            <AddDeviceButton onClick={onAddDevice} />
          </div>
        </div>
        <div className="device-column device-column-single">
          {filteredDevices.length > 0 ? (
            filteredDevices.map((device) => (
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
    </div>
  );
};

export default DeviceList;
