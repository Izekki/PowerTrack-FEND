/*import React, { useEffect, useState } from "react";
import "../styles/CreateGroupModal.css";

const EditDeviceModal = ({isOpen , onClose, onUpdate }) => {
  const [deviceData, setDeviceData] = useState(editingDevice || {});

    useEffect(() => {
    if (isOpen) {
        fetch(`http://localhost:5051/device/obtenerPorId${deviceData.id}`)
        .then((res) => res.json())
        .then((data) => {
          setDeviceData(data);
        })
        .catch((err) => {
            console.error("Error al obtener dispositivo:", err);
            setDeviceData({});
        });
        setDeviceData(editingDevice || {});
    }
    }, [isOpen, editingDevice]);

         

  const handleChange = (e) => {
    setDeviceData({ ...deviceData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`http://localhost:5051/device/editar/${deviceData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dispositivo_nombre: deviceData.dispositivo_nombre,
          ubicacion: deviceData.ubicacion,
          id_grupo: deviceData.id_grupo,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el dispositivo");
      }

      const updatedDevice = await response.json();
      onUpdate(updatedDevice); // Actualizar lista de dispositivos en el estado principal
      onClose(); // Cerrar modal después de guardar
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Hubo un problema al actualizar el dispositivo");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Editar Dispositivo</h3>
        <form onSubmit={handleSubmit}>
          <label>Nombre:</label>
          <input
            type="text"
            name="dispositivo_nombre"
            value={deviceData.dispositivo_nombre || ""}
            onChange={handleChange}
            autoFocus
          />

          <label>Ubicación:</label>
          <input
            type="text"
            name="ubicacion"
            value={deviceData.ubicacion || ""}
            onChange={handleChange}
          />

          <label>ID Grupo:</label>
          <input
            type="number"
            name="id_grupo"
            value={deviceData.id_grupo ?? ""}
            onChange={handleChange}
          />

          <div className="modal-buttons">
            <button type="submit">Guardar</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDeviceModal;*/

import React, { useEffect, useState } from "react";
import "../styles/CreateGroupModal.css";

// EditDeviceModal.jsx
const EditDeviceModal = ({ isOpen, onClose, onDeviceUpdate, editingDevice }) => {
  const [deviceData, setDeviceData] = useState(editingDevice || {});

  useEffect(() => {
    if (isOpen && editingDevice) {
      setDeviceData(editingDevice);
    }
  }, [isOpen, editingDevice]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeviceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Función que se ejecuta al hacer clic en el botón
  const handleUpdateClick = async () => {
    if (!deviceData.dispositivo_nombre || !deviceData.ubicacion) {
      alert("Todos los campos son obligatorios");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5051/device/editar/${deviceData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: deviceData.dispositivo_nombre.trim(),
          ubicacion: deviceData.ubicacion.trim(),
          id_grupo: deviceData.id_grupo ? Number(deviceData.id_grupo) : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error al actualizar el dispositivo: ${errorData.message}`);
      }

      const updatedDevice = await response.json();
      console.log("Dispositivo actualizado:", updatedDevice); // Verifica la respuesta del backend

      onDeviceUpdate(updatedDevice); // Llama a la función pasada por props
      onClose(); // Cierra el modal
    } catch (error) {
      console.error("❌ Error al actualizar:", error);
      alert(error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Editar Dispositivo</h3>
        <form>
          <label>Nombre:</label>
          <input
            type="text"
            name="dispositivo_nombre"
            value={deviceData.dispositivo_nombre || ""}
            onChange={handleChange}
            autoFocus
          />
          <br />
          <label>Ubicación:</label>
          <input
            type="text"
            name="ubicacion"
            value={deviceData.ubicacion || ""}
            onChange={handleChange}
          />
          <br />
          <label>ID Grupo:</label>
          <input
            type="number"
            name="id_grupo"
            value={deviceData.id_grupo ?? ""}
            onChange={handleChange}
          />

          <div className="modal-buttons">
            <button type="button" onClick={handleUpdateClick}>Guardar</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDeviceModal;
