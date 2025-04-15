import React, { useEffect, useState } from "react";
import "../styles/EditGroupPage.css";
import { showAlert } from "../components/Alert";

const EditGroupPage = ({ isOpen, onClose, group, onGroupUpdated }) => {
  const [groupName, setGroupName] = useState(group?.name || "");
  const [inGroupDevices, setInGroupDevices] = useState([]);
  const [outGroupDevices, setOutGroupDevices] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState([]);
  const usuarioId = group?.usuario_id;

  useEffect(() => {
    if (group && isOpen) {
      fetch(`http://localhost:5051/groups/grupo/${group.id}/dispositivos?usuarioId=${usuarioId}`)
        .then(res => res.json())
        .then(data => {
          setInGroupDevices(data.inGroup || []);
          setOutGroupDevices(data.outGroup || []);
          setSelectedDevices(data.inGroup.map(d => d.id));
        });
    }
  }, [group, isOpen]);

  const toggleDevice = (deviceId) => {
    if (selectedDevices.includes(deviceId)) {
      setSelectedDevices(prev => prev.filter(id => id !== deviceId));
    } else {
      setSelectedDevices(prev => [...prev, deviceId]);
    }
  };

  const handleUpdate = () => {
    fetch("http://localhost:5051/groups/edit", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: group.id,
        name: groupName,
        devices: selectedDevices,
        usuarioId: usuarioId
      })
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Hubo un error al actualizar el grupo.");
        }
        return res.json();
      })
      .then(() => {
        showAlert("success", "Grupo actualizado correctamente"); // Debería pasar el tipo "success" aquí
        onGroupUpdated();
        onClose();
      })
      .catch(error => {
        showAlert("error", error.message); // Debería pasar el tipo "error" aquí
      });
  };
  

  if (!isOpen || !group) return null;

  return (
    <div className="edit-group-container">
      <div className="header-container-modal-edit-group">
        <h2 className="title-edit-group">Editar Grupo</h2>
        <button className="btn-close-edit-group" onClick={onClose}>Volver</button>
      </div>

      <div className="form-edit-group">
        <label>Nombre del Grupo</label>
        <input
          type="text"
          className="input-edit-group"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
      </div>

      <div className="device-lists-container">
        <div className="device-list">
          <h3>En el Grupo</h3>
          <ul>
            {inGroupDevices.map(device => (
              <li key={device.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedDevices.includes(device.id)}
                    onChange={() => toggleDevice(device.id)}
                  />
                  {device.nombre}
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="device-list">
          <h3>No en el Grupo</h3>
          <ul>
            {outGroupDevices.map(device => (
              <li key={device.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedDevices.includes(device.id)}
                    onChange={() => toggleDevice(device.id)}
                  />
                  {device.nombre}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button className="btn-save-group" onClick={handleUpdate}>Guardar Cambios</button>
    </div>
  );
};

export default EditGroupPage;
