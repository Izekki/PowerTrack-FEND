import React, { useState, useEffect } from "react";
import "../../styles/DeviceComponentsCss/CreateGroupModal.css";
import { showAlert } from "../CommonComponents/Alert.jsx";
import { apiGet, apiPost } from "../../utils/apiHelper";

const CreateGroupModal = ({ isOpen, onClose, onGroupCreated}) => {
  const [groupName, setGroupName] = useState("");
  const [devices, setDevices] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const usuarioId = sessionStorage.getItem("userId");


  useEffect(() => {
    if (isOpen) {
      setGroupName("");
      setSelectedDevices([]);

      apiGet(`/device/unassigned/${usuarioId}`)
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
      await showAlert("error", "El nombre del grupo no puede estar vacío.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await apiPost(`/groups/create`, { name: groupName, devices: selectedDevices,usuarioId:usuarioId});

      await showAlert("success", "Grupo creado correctamente");

      if(onGroupCreated){
        onGroupCreated();
      }


      onClose(); 
    } catch (err) {
      console.error("Error al crear el grupo:", err);
      await showAlert("error", `${err.message}`);
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
          <label htmlFor="group-name">
            Nombre del grupo
            <span className="required-indicator">*</span>
          </label>
          <input
            id="group-name"
            type="text"
            placeholder="Nombre del grupo"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
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
