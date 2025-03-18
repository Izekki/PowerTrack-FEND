import React, { useState, useEffect } from "react";
import DeviceCard from "./DeviceCard";
import SearchBar from "./SearchBard";
import "../styles/DeviceList.css";

const DeviceList = () => {
  const [devices, setDevices] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5051/device/obtener")
      .then((response) => response.json())
      .then((data) => {
        setDevices(data);
        setFilteredDevices(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener dispositivos:", error);
        setLoading(false);
      });
  }, []);

  const handleSearch = (query) => {
    if (!query) {
      setFilteredDevices(devices);
    } else {
      setFilteredDevices(
        devices.filter((device) =>
          device.dispositivo_nombre.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  };

  if (loading) {
    return <p>Cargando dispositivos...</p>;
  }

  // Agrupar dispositivos por grupo
  const groupedDevices = {};
  filteredDevices.forEach((device) => {
    if (device.grupo_nombre) { // Solo si tiene un grupo
      if (!groupedDevices[device.grupo_nombre]) {
        groupedDevices[device.grupo_nombre] = [];
      }
      groupedDevices[device.grupo_nombre].push(device);
    }
  });

  return (
    <div className="device-list">
      <SearchBar onSearch={handleSearch} />
      <div className="device-actions">
        <button className="add-device">Agregar Dispositivo</button>
        <button className="add-group">Agregar Grupo</button>
      </div>
      <div className="device-grid">
        {/* Mostrar dispositivos agrupados */}
        {Object.keys(groupedDevices).map((groupName) => (
          <div key={groupName} className="device-group">
            <div className="group-card">
              <h3>{groupName}</h3>
              <div className="device-list">
                {groupedDevices[groupName].map((device) => (
                  <DeviceCard key={device.id} {...device} />
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Mostrar dispositivos que no están en ningún grupo */}
        {filteredDevices
          .filter(device => !device.grupo_nombre) // Dispositivos sin grupo
          .map((device) => (
            <DeviceCard key={device.id} {...device} />
        ))}
      </div>
    </div>
  );
};

export default DeviceList;
