import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import HistorialLineChart from "../components/ConsumoComponets/HistorialLineChart";
import "../styles/ConsumoPage.css";
import "../styles/HistorialPage.css";
import ReportePDFPage from "../components/ConsumoComponets/ReportePDFPage";
import ModalReporte from "../components/ConsumoComponets/ModalReporte";


const DOMAIN_URL = import.meta.env.VITE_BACKEND_URL;

const HistorialPage = () => {
  const { userId } = useAuth();
  const [historialData, setHistorialData] = useState([]);
  const [rangoSeleccionado, setRangoSeleccionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");
  const [reporte, setReporte] = useState(null);
  const [mostrarReporte, setMostrarReporte] = useState(false);

  const rangosDisponibles = [
    { value: "dia", label: "Día" },
    { value: "semana", label: "Semana" },
    { value: "mes", label: "Mes" },
    { value: "bimestre", label: "Bimestre" },
  ];

  useEffect(() => {
    if (userId) {
      fetch(`${DOMAIN_URL}/electrical_analysis/historial_detallado/${userId}`)
        .then(async (res) => {
          const contentType = res.headers.get("content-type");
          if (!res.ok) {
            const text = await res.text();
            throw new Error(`Error ${res.status}: ${text}`);
          }
          if (contentType && contentType.includes("application/json")) {
            return res.json();
          } else {
            const text = await res.text();
            throw new Error(`Respuesta no es JSON: ${text}`);
          }
        })
        .then((data) => {
          if (Array.isArray(data)) {
            setHistorialData(data);
          } else {
            setHistorialData([]);
          }
        })
        .catch(() => setHistorialData([]));
    }
  }, [userId]);

  const getFechaRango = (rango) => {
    const hoy = new Date();
    let fechaInicio = null;
    let fechaFinal = new Date();

    switch (rango) {
      case "dia":
        fechaInicio = new Date(hoy);
        fechaInicio.setDate(hoy.getDate() - 1);
        break;
      case "semana":
        fechaInicio = new Date(hoy);
        fechaInicio.setDate(hoy.getDate() - 7);
        break;
      case "mes":
        fechaInicio = new Date(hoy);
        fechaInicio.setMonth(hoy.getMonth() - 1);
        break;
      case "bimestre":
        fechaInicio = new Date(hoy);
        fechaInicio.setMonth(hoy.getMonth() - 2);
        break;
      default:
        return { fechaInicio: "", fechaFinal: "" };
    }

    return {
      fechaInicio: fechaInicio.toISOString().split("T")[0],
      fechaFinal: fechaFinal.toISOString().split("T")[0],
    };
  };

  const generarReporte = () => {
    if (!rangoSeleccionado) {
      alert("Por favor selecciona un rango de tiempo.");
      return;
    }

    const { fechaInicio, fechaFinal } = getFechaRango(rangoSeleccionado);

    const url = `${DOMAIN_URL}/user/reports/${userId}`;

    const body = {
      fechaInicio: `${fechaInicio}T00:00:00Z`,
      fechaFinal: `${fechaFinal}T23:59:59Z`,
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => {
        setReporte(data);
        setMostrarReporte(true);
      })
      .catch((err) => {
        console.error("Error al obtener el reporte:", err);
        alert("No se pudo cargar el reporte.");
      });
  };

  return (
    <div className="consumo-card">
      <div className="consumo-container">
        {/* COLUMNA IZQUIERDA */}
        <div className="columna-izquierda">
          <h3 className="title-consumotitle">Historial de Consumo</h3>
          <table className="historial-table">
            <thead>
              <tr>
                <th>Rango de fecha</th>
                <th>Promedio KW/h</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(historialData) &&
                rangosDisponibles.map((r) => {
                  const item = historialData.find((d) => d.rango === r.value);
                  const promedios =
                    item?.detalles?.map((d) => d.promedio) || [];
                  const promedioGlobal =
                    promedios.length > 0
                      ? (
                          promedios.reduce((sum, val) => sum + val, 0) /
                          promedios.length
                        ).toFixed(3)
                      : "N/D";
                  return (
                    <tr
                      key={r.value}
                      className={
                        rangoSeleccionado === r.value ? "fila-activa" : ""
                      }
                      onClick={() => setRangoSeleccionado(r.value)}
                      style={{ cursor: "pointer" }}
                    >
                      <td style={{ textTransform: "capitalize" }}>{r.label}</td>
                      <td>
                        {promedioGlobal !== "N/D"
                          ? `${promedioGlobal} kWh`
                          : "N/D"}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          <div
            className="generar-reporte-container"
            style={{ marginTop: "20px" }}
          >
            <h4 >Generar Reporte</h4>
            <button onClick={generarReporte} className="ver-mas-btn">
              Generar PDF
            </button>

            {rangoSeleccionado && (
              <p
                style={{ fontSize: "0.9em", color: "#666", marginTop: "10px" }}
              >
                Rango usado: {getFechaRango(rangoSeleccionado).fechaInicio} al{" "}
                {getFechaRango(rangoSeleccionado).fechaFinal}
              </p>
            )}

            {mostrarReporte && reporte && (
              <ModalReporte
                reporte={reporte}
                onClose={() => setMostrarReporte(false)}
              />
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA */}
        <div className="columna-derecha">
          <h4 className="graph-title">Detalle del Historial</h4>
          {rangoSeleccionado ? (
            (() => {
              const item = historialData.find(
                (d) => d.rango === rangoSeleccionado
              );
              const detalles = item?.detalles || [];

              if (detalles.length === 0) {
                return <p>No hay datos disponibles para este rango.</p>;
              }

              const promedios = detalles.map((d) => d.promedio);
              const promedioGlobal = (
                promedios.reduce((sum, val) => sum + val, 0) / promedios.length
              ).toFixed(3);
              const min = Math.min(...promedios).toFixed(3);
              const max = Math.max(...promedios).toFixed(3);

              return (
                <div>
                  <p>
                    <strong>Rango:</strong> {rangoSeleccionado}
                  </p>
                  <p>
                    <strong>Promedio:</strong> {promedioGlobal} kWh
                  </p>
                  <p>
                    <strong>Mínimo:</strong> {min} kWh
                  </p>
                  <p>
                    <strong>Máximo:</strong> {max} kWh
                  </p>
                  <ul>
                    {detalles.map((d, idx) => (
                      <li key={idx}>
                        <strong>{d.etiqueta}</strong>: {d.promedio} kWh
                      </li>
                    ))}
                  </ul>
                  <div
                    className="grafica-placeholder"
                    style={{ cursor: "pointer" }}
                    onClick={() => setModalVisible(true)}
                  >
                    <HistorialLineChart detalles={detalles} />
                  </div>
                </div>
              );
            })()
          ) : (
            <p>Selecciona un rango para ver el detalle.</p>
          )}
        </div>

        {/* MODAL */}
        {modalVisible && (
          <div
            className="modal-grafica"
            onClick={() => setModalVisible(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
            }}
          >
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: "#fff",
                padding: "1rem",
                borderRadius: "8px",
                width: "90%",
                height: "80%",
              }}
            >
              <h3 style={{ textAlign: "center" }}>
                Vista ampliada del gráfico
              </h3>
              <HistorialLineChart
                detalles={
                  historialData.find((d) => d.rango === rangoSeleccionado)
                    ?.detalles || []
                }
                isModal
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistorialPage;
