import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/ConsumoPage.css";
import "../styles/HistorialPage.css";

const DOMAIN_URL = import.meta.env.VITE_BACKEND_URL;

const HistorialPage = () => {
  const { userId } = useAuth();
  const [historialData, setHistorialData] = useState([]);
  const [rango, setRango] = useState("dia");
  const [rangoSeleccionado, setRangoSeleccionado] = useState(null); 

  const rangosDisponibles = [
    { value: "dia", label: "Día" },
    { value: "semana", label: "Semana" },
    { value: "mes", label: "Mes" },
    { value: "bimestre", label: "Bimestre" },
  ];

  useEffect(() => {
    if (userId) {
        fetch(`${DOMAIN_URL}/electrical_analysis/historial/${userId}?rango=${rango}`)
        .then(async (res) => {
            const contentType = res.headers.get("content-type");

            if (!res.ok) {
            const text = await res.text(); // Para mostrar posibles errores
            throw new Error(`Error ${res.status}: ${text}`);
            }

            if (contentType && contentType.includes("application/json")) {
            return res.json();
            } else {
            const text = await res.text(); // puede ser HTML o texto vacío
            throw new Error(`Respuesta no es JSON: ${text}`);
            }
        })
        .then((data) => {
            console.log("Respuesta del backend:", data);
            if (Array.isArray(data)) {
            setHistorialData(data);
            } else {
            console.warn("Respuesta inesperada del backend:", data);
            setHistorialData([]);
            }
        })
        .catch((err) => {
            console.error("Error al obtener historial:", err);
            setHistorialData([]);
        });
    }
  }, [userId, rango]);


  // Agrupar datos por rango
    const rangos = ["dia", "semana", "mes", "bimestre"];


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
                  const itemsDelRango = historialData.filter((d) => d.rango === r.value);
                  const pmins = itemsDelRango.map((d) => d.pmin);
                  const pmaxs = itemsDelRango.map((d) => d.pmax);
                  const pmin = pmins.length ? Math.min(...pmins).toFixed(3) : null;
                  const pmax = pmaxs.length ? Math.max(...pmaxs).toFixed(3) : null;

                  return (
                    <tr
                      key={r.value}
                      className={rangoSeleccionado === r.value ? "fila-activa" : ""}
                      onClick={() => setRangoSeleccionado(r.value)} // 👈 marcar fila activa
                      style={{ cursor: "pointer" }}
                    >
                      <td style={{ textTransform: "capitalize" }}>{r.label}</td>
                      <td>
                        {pmin != null && pmax != null
                            ? `${pmin} KW/h - ${pmax} KW/h`
                            : "N/D"}
                        </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* COLUMNA DERECHA */}
        <div className="columna-derecha">
          <h4 className="graph-title">Detalle del Historial</h4>

          {rangoSeleccionado ? (
            (() => {
              const item = historialData.find((d) => d.rango === rangoSeleccionado);
              return item ? (
                <div>
                  <p><strong>Rango:</strong> {rangoSeleccionado}</p>
                  <p><strong>Mínimo:</strong> {item.pmin} kWh</p>
                  <p><strong>Máximo:</strong> {item.pmax} kWh</p>
                  <p><strong>Promedio:</strong> {item.promedio} kWh</p>

                  {/* 👇 Aquí podrías renderizar una gráfica real */}
                  <div className="grafica-placeholder">
                    📊 Aquí va la gráfica de "{rangoSeleccionado}"
                  </div>
                </div>
              ) : (
                <p>No hay datos disponibles para este rango.</p>
              );
            })()
          ) : (
            <p>Selecciona un rango para ver el detalle.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistorialPage;
