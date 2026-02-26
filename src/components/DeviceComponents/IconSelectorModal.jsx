import { useState } from "react";
import "../../styles/DeviceComponentsCss/IconSelectorModal.css";
import { showAlert } from "../CommonComponents/Alert.jsx";
import { apiPut } from "../../utils/apiHelper";

const images = import.meta.glob("../../assets/devices-icons/*.{png,svg}", {
  eager: true,
  import: "default",
});

const iconNames = {
  0: "Sin especificar",
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
  17: "Plancha"
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
      const updatedDevice = await apiPut(`/device/editar/icono/${device.id}`, { id_tipo_dispositivo: Number(selectedId) });

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
