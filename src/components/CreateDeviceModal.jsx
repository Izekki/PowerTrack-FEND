import React, { useState } from "react";
import "../styles/CreateDeviceModal.css";

const CreateDeviceModal = ({ isOpen, onClose, onDeviceCreated }) => {
  const [nombre, setNombre] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const usuarioId = sessionStorage.getItem("userId");
  const [idGrupo, setIdGrupo] = useState("");  // Opcional
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    // Validación básica
    if (!nombre.trim() || !ubicacion.trim() || !usuarioId.trim()) {
      alert("Por favor, completa todos los campos obligatorios.");
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
          usuario_id: parseInt(usuarioId, 10),  // Convierte a número
          id_grupo: idGrupo ? parseInt(idGrupo, 10) : null  // Si no hay id_grupo, envía null
        }),
      });

      if (!response.ok) {
        throw new Error("Error al crear el dispositivo");
      }

      const result = await response.json();
      alert(`Dispositivo creado con éxito! ID: ${result.id}`);

      onClose();
      onDeviceCreated();
    } catch (err) {
      console.error("Error al crear el dispositivo:", err);
      setError(err.message);
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
            onChange={(e) => setUsuarioId(e.target.value)}
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

        {error && <p className="error-message">{error}</p>}

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
