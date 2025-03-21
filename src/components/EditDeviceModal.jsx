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

const EditDeviceModal = ({ isOpen, onClose, onUpdate, editingDevice }) => {
  //const [deviceData, setDeviceData] = useState(editingDevice || {});

  console.log(editingDevice);
  const [deviceData, setDeviceData] = useState({
    name: "",
    ubicacion: "",
    id_usuario: "",
    id_grupo: "",
  });
  
  useEffect(() => {
    if (isOpen && editingDevice?.name) {
      fetch(`http://localhost:5051/device/obtenerPorId/${editingDevice.name}`)
        .then((res) => res.json())
        .then((data) => {
          setDeviceData({
            id: editingDevice.id,  // Asegurar que se guarda el ID
            name: data.name || "",
            ubicacion: data.ubicacion || "",
            id_usuario: data.id_usuario ?? "",
            id_grupo: data.id_grupo ?? ""
          });
        })
        .catch((err) => {
          console.error("Error al obtener dispositivo:", err);
          setDeviceData({});
        });
    }
  }, [isOpen, editingDevice]);

  /*const handleChange = (e) => {
    setDeviceData({ ...deviceData, [e.target.name]: e.target.value });
  };*/

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setDeviceData((prevData) => ({
      ...prevData, 
      [name]: value
    }));
  };
  
  

  /*const handleSubmit = async (e) => {
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
      onUpdate(updatedDevice);
      onClose();
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Hubo un problema al actualizar el dispositivo");
    }
  };*/

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Asegurar que todos los campos estén completos
    if (!deviceData.name || !deviceData.ubicacion || !deviceData.id_usuario || !deviceData.id_grupo) {
      alert("Todos los campos son obligatorios");
      return;
    }
  
    // Verificar qué datos se están enviando antes de la petición
    console.log("📤 Enviando datos:", JSON.stringify(deviceData));
  
    try {
      const response = await fetch(`http://localhost:5051/device/editar/${deviceData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: deviceData.name.trim(),
          ubicacion: deviceData.ubicacion.trim(),
          id_usuario: deviceData.id_usuario ? Number(deviceData.id_usuario) : null,
          id_grupo: deviceData.id_grupo ? Number(deviceData.id_grupo) : null,
        }),
      });
  
      console.log("🔄 Código de respuesta:", response.status);
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error al actualizar el dispositivo: ${errorData.message}`);
      }
  
      const updatedDevice = await response.json();
      onUpdate(updatedDevice);
      onClose(); 
    } catch (error) {
      console.error("❌ Error al actualizar:", error);
      alert(error.message);
    }
  };
  
  

  if (!isOpen) return null; // Evita renderizar cuando el modal está cerrado

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Editar Dispositivo</h3>
        <form onSubmit={handleSubmit}>
          <label>Nombre:</label>
          <input
            type="text"
            name="name"
            value={deviceData.name || ""}
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
          <label>ID Usuario:</label>
          <input
            type="number"
            name="id_usuario"
            value={deviceData.id_usuario ?? ""}
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

export default EditDeviceModal;

