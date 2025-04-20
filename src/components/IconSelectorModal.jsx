import { useState } from "react";
import "../styles/IconSelectorModal.css";
import { showAlert } from "./Alert.jsx";
const DOMAIN_URL = import.meta.env.VITE_BACKEND_URL

const images = import.meta.glob("../assets/devices-icons/*.{png,svg}", {
  eager: true,
  import: "default",
});

const iconNames = {
  1: "Televisor",
  2: "Computadora de escritorio",
  3: "Laptop",
  4: "Aire acondicionado",
  5: "Refrigerador",
  6: "Microondas",
  7: "Consola de videojuegos",
  8: "Arrocera",
  9: "Módem",
  10: "Lavadora",
  11: "Proyector",
  12: "Impresora",
  13: "Secadora de pelo",
  14: "Bocinas",
  15: "Teléfono fijo",
  16: "Ventilador",
  17: "Plancha",
  0: "Sin especificar",
};

const IconSelectorModal = ({ device, onClose, onDeviceUpdated }) => {
  const [selectedId, setSelectedId] = useState(String(device.id_tipo_dispositivo));
  const [loading, setLoading] = useState(false);

  const iconOptions = Object.entries(images).map(([path, src]) => {
    const fileName = path.split("/").pop();
    const id = fileName.split(".")[0];
    return { id, src, name: iconNames[id] || "Desconocido" };
  });

  const handleConfirm = async () => {
    if (Number(selectedId) === device.id_tipo_dispositivo) {
      onClose();
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${DOMAIN_URL}/device/editar/icono/${device.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_tipo_dispositivo: Number(selectedId) }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Error al actualizar el ícono");
      }

      const updatedDevice = await res.json();
      onDeviceUpdated(updatedDevice);
      onClose();
      showAlert("success", "Ícono actualizado con éxito");
    } catch (err) {
      console.error("❌ Error al actualizar ícono:", err.message);
       await showAlert("Hubo un error al actualizar el ícono");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-icon-modal-overlay">
      <div className="edit-icon-modal">
        <h3 className="icon-modal-title">Selecciona un ícono</h3>
        <div className="icon-edit-icon-grid">
          {iconOptions.map(({ id, src, name }) => (
            <div
              key={id}
              className={`edit-icon-option ${selectedId === id ? "selected" : ""}`}
              onClick={() => setSelectedId(id)}
            >
              <img src={src} alt={`Icon ${id}`} />
              <p>{name}</p>
            </div>
          ))}
        </div>
        <div className="edit-icon-buttons">
          <button onClick={handleConfirm} className="icon-selector-btn-accept" disabled={loading}>
            {loading ? "Guardando..." : "Aceptar"}
          </button>
          <button onClick={onClose} className="icon-selector-btn-cancel" disabled={loading}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default IconSelectorModal;
