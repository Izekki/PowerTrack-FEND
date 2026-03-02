import React, { useEffect, useState } from "react";
import "../styles/EditGroupPage.css";
import { showAlert } from "../components/CommonComponents/Alert";
import { apiGet, apiPut } from "../utils/apiHelper";
import BackButton from "../components/CommonComponents/BackButton";
import Breadcrumb from "../components/CommonComponents/Breadcrumb";

// Cargar los iconos dinámicamente
const images = import.meta.glob("../assets/devices-icons/*.{png,svg}", {
  eager: true,
  import: "default",
});

const EditGroupPage = ({ isOpen, onClose, group, onGroupUpdated }) => {
  const [groupName, setGroupName] = useState(group?.name || "");
  const [inGroupDevices, setInGroupDevices] = useState([]);
  const [outGroupDevices, setOutGroupDevices] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState([]);
  const usuarioId = group?.usuario_id;

  const breadcrumbItems = [
    { label: "Dispositivos", onClick: onClose },
    { label: "Editar Grupo", active: true }
  ];

  useEffect(() => {
    if (group && isOpen) {
      apiGet(`/groups/grupo/${group.id}/dispositivos?usuarioId=${usuarioId}`)
        .then(data => {
          setInGroupDevices(data.inGroup || []);
          setOutGroupDevices(data.outGroup || []);
          setSelectedDevices(data.inGroup.map(d => d.id));
        })
        .catch(err => {
          console.error("Error al cargar dispositivos del grupo:", err);
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
    apiPut(`/groups/edit`, {
      id: group.id,
      name: groupName,
      devices: selectedDevices,
      usuarioId: usuarioId
    })
      .then(() => {
        showAlert("success", "Grupo actualizado correctamente");
        onGroupUpdated();
        onClose();
      })
      .catch(error => {
        showAlert("error", error.message);
      });
  };

  const getIconPath = (id) => {
    // Buscar primero el icono específico para este id
    const imagePath = `../assets/devices-icons/${id}.png`;
    // Si no lo encuentra, usar 0.svg como valor predeterminado
    const defaultPath = "../assets/devices-icons/0.svg";
    
    return images[imagePath] || images[defaultPath] || images["../assets/devices-icons/noimage-card.svg"];
  };

  if (!isOpen || !group) return null;

  return (
    <div className="edit-group-container">
      <div className="breadcrumb-topbar">
        <Breadcrumb items={breadcrumbItems} />
        <div className="breadcrumb-actions">
          <BackButton className="btn-close-edit-group" onClick={onClose} />
        </div>
      </div>
      <div className="header-container-modal-edit-group">
        <h2 className="title-edit-group">Editar Grupo</h2>
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
              <li key={device.id} className="device-list-item">
                <label className="device-label">
                  <input
                    type="checkbox"
                    checked={selectedDevices.includes(device.id)}
                    onChange={() => toggleDevice(device.id)}
                    className="device-checkbox"
                  />
                  <div className="device-info">
                    <img src={getIconPath(device.id_tipo_dispositivo)} alt={device.nombre} className="device-icon" />
                    <span className="device-name">{device.nombre}</span>
                  </div>
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="device-list">
          <h3>Sin Grupo</h3>
          <ul>
            {outGroupDevices.map(device => (
              <li key={device.id} className="device-list-item">
                <label className="device-label">
                  <input
                    type="checkbox"
                    checked={selectedDevices.includes(device.id)}
                    onChange={() => toggleDevice(device.id)}
                    className="device-checkbox"
                  />
                  <div className="device-info">
                    <img src={getIconPath(device.id_tipo_dispositivo)} alt={device.nombre} className="device-icon" />
                    <span className="device-name">{device.nombre}</span>
                  </div>
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