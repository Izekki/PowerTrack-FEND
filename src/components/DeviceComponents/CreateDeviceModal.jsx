import React, { useState, useEffect } from "react";
import "../../styles/DeviceComponentsCss/CreateDeviceModal.css";
import { showAlert } from "../CommonComponents/Alert.jsx"; // Importa la función showAlert

const DOMAIN_URL = import.meta.env.VITE_BACKEND_URL

const CreateDeviceModal = ({ isOpen, onClose, onDeviceCreated }) => {
  const [nombre, setNombre] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const usuarioId = sessionStorage.getItem("userId");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [missingFields, setMissingFields] = useState({
    nombre: false
  });

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
      setLoading(false);
      setError(null);
      setMissingFields({ nombre: false });
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
    setError(null);

    const nombreValue = nombre.trim();
    const ubicacionValue = ubicacion.trim();
    const missing = {
      nombre: !nombreValue
    };

    setMissingFields(missing);

    // Validación en frontend antes de enviar la solicitud
    if (missing.nombre) {
      await showAlert("error", "Los campos obligatorios deben ser completados.");
      return;
    }

    if (!usuarioId || isNaN(usuarioId) || (idGrupo && isNaN(idGrupo))) {
      await showAlert("error", "No se encontro un usuario valido o el grupo no es valido.");
      return;
    }

    const mac = sensorId.trim(); // sensorId contiene la MAC desde el input
    const macRegex = /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/;
    if (mac && !macRegex.test(mac)) {
      await showAlert("error", "Formato de direccion MAC invalido. Usa el formato 00:00:00:00:00:00");
      return;
    }

    const macValue = mac || null;

    setLoading(true);

    try {
      const response = await fetch(`${DOMAIN_URL}/device/devices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          ubicacion: ubicacionValue,
          usuario_id: parseInt(usuarioId, 10),
          id_grupo: idGrupo ? parseInt(idGrupo, 10) : null,
          mac: macValue
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Error al crear el dispositivo");
      }

      await showAlert("success", "Dispositivo creado correctamente");
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
          <label htmlFor="nombre">
            Nombre del dispositivo
            <span className="required-indicator">*</span>
          </label>
          <input
            id="nombre"
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value);
              if (missingFields.nombre) {
                setMissingFields((prev) => ({ ...prev, nombre: false }));
              }
            }}
            required
            className={missingFields.nombre ? "input-error" : ""}
          />
        </div>

        <div className="input-group">
          <label htmlFor="ubicacion">
            Descripción (opcional)
          </label>
          <input
            id="ubicacion"
            type="text"
            placeholder="Descripción"
            value={ubicacion}
            onChange={(e) => {
              setUbicacion(e.target.value);
            }}
          />
        </div>

        <div className="select-group">
          <label htmlFor="idGrupo">Grupos (opcional)</label>
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
          <label htmlFor="macAddress">Direccion MAC del sensor<span className="required-indicator">*</span></label>
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
