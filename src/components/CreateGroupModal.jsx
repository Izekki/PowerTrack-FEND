import React, { useState, useEffect } from "react";
import "../styles/CreateGroupModal.css";

const CreateGroupModal = ({ isOpen, onClose, onGroupCreated }) => {
  const [groupName, setGroupName] = useState("");
  const [devices, setDevices] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setGroupName("");
      setSelectedDevices([]);

      fetch("http://localhost:5051/device/unassigned")
        .then((res) => res.json())
        .then((data) => {
          setDevices(data); 
        })
        .catch((err) => {
          console.error("Error al obtener dispositivos:", err);
          setDevices([]); 
        });
    }
  }, [isOpen]);

  const handleDeviceSelect = (deviceId) => {
    setSelectedDevices((prev) =>
      prev.includes(deviceId)
        ? prev.filter((id) => id !== deviceId)
        : [...prev, deviceId]
    );
  };

  const handleSubmit = async () => {
    if (!groupName.trim()) {
      alert("El nombre del grupo no puede estar vacío.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5051/groups/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: groupName, devices: selectedDevices }),
      });

      if (!response.ok) {
        throw new Error("Error al crear el grupo");
      }

      const result = await response.json();
      alert(`Grupo creado con éxito! ID: ${result.groupName}`);

      onClose(); 
      onGroupCreated();
    } catch (err) {
      console.error("Error al crear el grupo:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Crear Nuevo Grupo</h2>
        <div className="input-group">
          <label htmlFor="group-name">Nombre del grupo</label>
          <input
            id="group-name"
            type="text"
            placeholder="Nombre del grupo"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </div>

        <h3>Dispositivos No Agrupados</h3>
        <ul className="device-list">
          {devices.length > 0 ? (
            devices.map((device) => (
              <li key={device.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedDevices.includes(device.id)}
                    onChange={() => handleDeviceSelect(device.id)}
                  />
                  {device.nombre} - {device.ubicacion}
                </label>
              </li>
            ))
          ) : (
            <li>No hay dispositivos disponibles</li>
          )}
        </ul>

        {error && <p className="error-message">{error}</p>}

        <div className="modal-actions">
          <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? "Creando..." : "Crear Grupo"}
          </button>
          <button className="cancel-btn" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
