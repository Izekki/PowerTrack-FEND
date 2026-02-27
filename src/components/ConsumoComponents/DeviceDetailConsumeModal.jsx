import React from "react";
import "../../styles/ConsumeComponentesCss/DeviceDetailConsumeModal.css"

const DeviceDetailConsumeModal = ({ selectedDevice, deviceDetails, showDetails, toggleDetails }) => {
  if (!selectedDevice) return null;

  return (
    <div className="mini-modal-cost">
      <h5>Costo del Consumo</h5>
      <p><strong>Dispositivo:</strong> {selectedDevice.dispositivo_nombre}</p>
      <p><strong>Costo estimado:</strong> ${selectedDevice.costoActual.toFixed(2)} MXN</p>
      <button className="ver-detalles-btn" onClick={toggleDetails}>
        {showDetails ? "Ver menos" : "Ver más"}
      </button>

      {showDetails && deviceDetails && (
        <div className="expanded-modal">
          <p><strong>Costo diario estimado (24/7 hrs):</strong> ${deviceDetails.estimacionCostoDiario.toFixed(2)} MXN</p>
          <p><strong>Costo mensual estimado:</strong> ${deviceDetails.estimacionCostoMensual.toFixed(2)} MXN</p>
          <p><strong>Proveedor:</strong> {deviceDetails.proveedor}</p>
          <p><strong>Unidad:</strong> {deviceDetails.unidad}</p>
          <p><strong>Tarifas:</strong></p>
          <ul>
            <li><strong>Fijo:</strong> ${deviceDetails.detalleTarifas.cargo_fijo}</li>
            <li><strong>Variable:</strong> ${deviceDetails.detalleTarifas.cargo_variable}</li>
            <li><strong>Distribución:</strong> ${deviceDetails.detalleTarifas.cargo_distribucion}</li>
            <li><strong>Capacidad:</strong> ${deviceDetails.detalleTarifas.cargo_capacidad}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DeviceDetailConsumeModal;
