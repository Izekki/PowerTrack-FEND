import React, { useState, useEffect } from "react";
import "../styles/CreateDeviceModal.css";
import { showAlert } from "./Alert.jsx"; // Importa la función showAlert

const DOMAIN_URL = import.meta.env.VITE_BACKEND_URL

const CreateDeviceModal = ({ isOpen, onClose, onDeviceCreated }) => {
  const [nombre, setNombre] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const usuarioId = sessionStorage.getItem("userId");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [sensoresDisponibles, setSensoresDisponibles] = useState([]);
  const [sensorId, setSensorId] = useState("");

  const [gruposDisponibles, setGruposDisponibles] = useState([]);
  const [idGrupo, setIdGrupo] = useState("");  // Opcional


  // Efecto para limpiar los campos cuando el modal se abre
  useEffect(() => {
    if (isOpen) {
      setNombre("");
      setUbicacion("");
      setIdGrupo("");
      setSensorId("");
    }
  }, [isOpen]);

  // Nuevo useEffect para obtener los grupos del usuario cuando el modal se abre
  useEffect(() => {
    const fetchGrupos = async () => {
      if (!usuarioId) return;

      try {
        const response = await fetch(`${DOMAIN_URL}/groups/byUser/${usuarioId}`);
        if (!response.ok) throw new Error("Error al obtener los grupos");
        const data = await response.json();
        setGruposDisponibles(data);
      } catch (error) {
        console.error("Error al obtener grupos:", error);
      }
    };

    if (isOpen) {
      fetchGrupos();
    }
  }, [isOpen, usuarioId]);


  useEffect(() => {
    const fetchSensores = async () => {
      try {
        const response = await fetch(`${DOMAIN_URL}/sensor/obtener`);
        const data = await response.json();
        setSensoresDisponibles(data);
      } catch (error) {
        console.error("Error al obtener sensores", error);
      }
      };
      fetchSensores();
    }, [isOpen]);

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

    const mac = sensorId.trim(); // sensorId contiene la MAC desde el input

    // Validación MAC obligatoria
    if (!mac) {
      await showAlert("error", "La dirección MAC es obligatoria.");
      return;
    }
    
    const macRegex = /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/;
    if (!macRegex.test(mac)) {
      await showAlert("error", "Formato de dirección MAC inválido. Usa el formato 00:00:00:00:00:00");
      return;
    }    


    try {
      const response = await fetch(`${DOMAIN_URL}/device/devices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          ubicacion,
          usuario_id: parseInt(usuarioId, 10),
          id_grupo: idGrupo ? parseInt(idGrupo, 10) : null,
          mac
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Error al crear el dispositivo");
      }

      await showAlert("success", `Dispositivo creado con éxito! ID: ${result.dispositivo_id}`);
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
          <label htmlFor="nombre">Nombre del dispositivo*</label>
          <input
            id="nombre"
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label htmlFor="ubicacion">Ubicación*</label>
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

        <div className="select-group">
          <label htmlFor="idGrupo">ID del grupo (opcional)</label>
          <select
            id="idGrupo"
            value={idGrupo}
            onChange={(e) => setIdGrupo(e.target.value)}
          >
          <option value="">-- Selecciona un grupo --</option>
            {gruposDisponibles.map((grupo) => (
              <option key={grupo.id} value={grupo.id}>
                {grupo.name}
                </option>
            ))}
            </select>
        </div>

        <div className="input-group">
          <label htmlFor="macAddress">Dirección MAC del sensor*</label>
          <input
            id="macAddress"
            type="text"
            placeholder="Ingresa la dirección MAC (00:00:00:00:00:00)"
            value={sensorId}
            onChange={(e) => setSensorId(e.target.value)}
          />
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
