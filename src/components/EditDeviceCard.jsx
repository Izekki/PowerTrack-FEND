import React, { useEffect, useState } from "react";
import "../styles/EditDeviceCard.css";
import { showAlert } from "./Alert.jsx";
const DOMAIN_URL = import.meta.env.VITE_BACKEND_URL

const EditDeviceCard = ({ device, onDeviceUpdated }) => {
  const [deviceData, setDeviceData] = useState(device || {});

  useEffect(() => {
    if (device) {
      setDeviceData(device);
    }
  }, [device]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeviceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateClick = async () => {
    if (!deviceData.dispositivo_nombre || !deviceData.ubicacion) {
      showAlert("error", "Todos los campos son obligatorios");
      return;
    }

    try {
      const response = await fetch(`${DOMAIN_URL}/device/editar/${deviceData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: deviceData.dispositivo_nombre.trim(),
          ubicacion: deviceData.ubicacion.trim(),
          id_grupo: deviceData.id_grupo ? Number(deviceData.id_grupo) : null,
          mac_address: deviceData.mac_address ? deviceData.mac_address.trim() : undefined, // <-- enviamos mac_address si existe
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error al actualizar el dispositivo: ${errorData.message}`);
      }

      const updatedDevice = await response.json();
      console.log("Dispositivo actualizado:", updatedDevice);

      onDeviceUpdated(updatedDevice);
      showAlert("success", "Dispositivo actualizado con éxito");
    } catch (error) {
      console.error("❌ Error al actualizar:", error);
      showAlert("error", error.message);
    }
  };

  return (
    <>
      <div className="edit-device-card">
        <h1 className="Title-Device">DATOS DEL DISPOSITIVO</h1>
        <h2 className="device-name-header">
          <b>Dispositivo:</b> {deviceData.dispositivo_nombre || "Nombre no disponible"}
        </h2>
        <form className="edit-device-form">
          <div className="edit-device-card-columns">
            <div>
              <label className="lbl1">Nombre del dispositivo</label>
              <input
                className="input-lbl"
                type="text"
                name="dispositivo_nombre"
                value={deviceData.dispositivo_nombre || ""}
                onChange={handleChange}
                required
              />
              <label className="lbl2">Ubicación</label>
              <input
                className="input-lbl"
                type="text"
                name="ubicacion"
                value={deviceData.ubicacion || ""}
                onChange={handleChange}
                required
              />
              <br />
              <label className="lbl2">MAC-Address</label>
              <input
                className="input-lbl"
                type="text"
                name="mac_address"
                value={deviceData.mac_address || ""}
                onChange={handleChange}
                placeholder="00:1A:2B:3C:4D:5E"
              />
            </div>
          </div>
          <button type="button" className="buttonEditar" onClick={handleUpdateClick}>
            Guardar Cambios
          </button>
        </form>
      </div>
    </>
  );
};

export default EditDeviceCard;
