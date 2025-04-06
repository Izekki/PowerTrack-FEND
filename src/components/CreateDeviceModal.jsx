import React, { useState, useEffect } from "react";
import "../styles/CreateDeviceModal.css";
import { showAlert } from "./Alert.jsx"; // Importa la función showAlert

const CreateDeviceModal = ({ isOpen, onClose, onDeviceCreated }) => {
  const [nombre, setNombre] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const usuarioId = sessionStorage.getItem("userId");
  const [idGrupo, setIdGrupo] = useState("");  // Opcional
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //nuevo
  const sensoresDisponibles = [
    { id: 1, nombre: "Sensor de Temperatura" },
    { id: 2, nombre: "Sensor de Humedad" },
    { id: 3, nombre: "Sensor de Movimiento" },
    { id: 4, nombre: "Sensor de Luz" },
  ];

  const [sensorId, setSensorId] = useState("");

  // Efecto para limpiar los campos cuando el modal se abre
  useEffect(() => {
    if (isOpen) {
      setNombre("");
      setUbicacion("");
      setIdGrupo("");
      setSensorId(""); // Limpia el campo de sensor
    }
  }, [isOpen]); // Se ejecuta cuando isOpen cambia

  const handleSubmit = async () => {
    // Validación en frontend antes de enviar la solicitud
    if (!nombre.trim() || !ubicacion.trim() || !usuarioId.trim()) {
      await showAlert("error", "Todos los campos obligatorios deben ser completados.");
      return;
    }

    if (isNaN(usuarioId) || (idGrupo && isNaN(idGrupo))) {
      await showAlert("error", "El ID de usuario y el ID del grupo deben ser números.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5051/device/devices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          ubicacion,
          usuario_id: parseInt(usuarioId, 10),
          id_grupo: idGrupo ? parseInt(idGrupo, 10) : null,
          id_sensor: sensorId ? parseInt(sensorId, 10) : null
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Error al crear el dispositivo");
      }

      await showAlert("success", `Dispositivo creado con éxito! ID: ${result.id}`);
      onClose();
      onDeviceCreated();
    } catch (err) {
      console.error("Error al crear el dispositivo:", err);
      await showAlert("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Crear Nuevo Dispositivo</h2>

        <div className="input-group">
          <label htmlFor="nombre">Nombre del dispositivo</label>
          <input
            id="nombre"
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="ubicacion">Ubicación</label>
          <input
            id="ubicacion"
            type="text"
            placeholder="Ubicación"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="usuarioId">ID del usuario</label>
          <input
            id="usuarioId"
            disabled
            type="number"
            placeholder="Usuario ID"
            value={usuarioId}
          />
        </div>

        <div className="input-group">
          <label htmlFor="idGrupo">ID del grupo (opcional)</label>
          <input
            id="idGrupo"
            type="number"
            placeholder="Grupo ID (opcional)"
            value={idGrupo}
            onChange={(e) => setIdGrupo(e.target.value)}
          />
        </div>

        <div className="select-group">
          <label htmlFor="sensorId">Selecciona un sensor</label>
          <select
            id="sensorId"
            value={sensorId}
            onChange={(e) => setSensorId(e.target.value)}
          >
            <option value="">-- Selecciona un sensor --</option>
            {sensoresDisponibles.map((sensor) => (
              <option key={sensor.id} value={sensor.id}>
                {sensor.nombre} (ID: {sensor.id})
              </option>
            ))}
          </select>
        </div>

        {error && <p className="error-message">{error}</p>} {/* Muestra el mensaje de error */}

        <div className="modal-actions">
          <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? "Creando..." : "Crear Dispositivo"}
          </button>
          <button className="cancel-btn" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default CreateDeviceModal;
