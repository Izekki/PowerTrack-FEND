import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import HistorialLineChart from "../components/ConsumoComponents/HistorialLineChart";
import "../styles/ConsumoPage.css";
import "../styles/HistorialPage.css";
import "../styles/EditDevicePage.css";
import ModalReporte from "../components/ConsumoComponents/ModalReporte";
import { useNavigate } from "react-router-dom";
import { showAlert } from "../components/CommonComponents/Alert.jsx";
import { apiGet, apiPost } from "../utils/apiHelper";
import BackButton from "../components/CommonComponents/BackButton";
import Breadcrumb from "../components/CommonComponents/Breadcrumb";

const HistorialPage = () => {
  const { userId } = useAuth();
  const [historialData, setHistorialData] = useState([]);
  const [rangoSeleccionado, setRangoSeleccionado] = useState(null);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [reporte, setReporte] = useState(null);
  const [mostrarReporte, setMostrarReporte] = useState(false);
  const navigate = useNavigate();

  const breadcrumbItems = [
    { label: "Consumo", onClick: () => navigate("/consumo") },
    { label: "Historial", active: true }
  ];

  const rangosDisponibles = [
    { value: "dia", label: "Día" },
    { value: "semana", label: "Semana" },
    { value: "mes", label: "Mes" },
    { value: "ano", label: "Año" },
  ];

  // Helper para consultar el historial en el backend usando fechas personalizadas
  const fetchHistorialConRango = (fInicio, fFin) => {
    if (!userId) return;
    setLoading(true);
    apiGet(`/electrical_analysis/historial_detallado/${userId}?fechaInicio=${fInicio}&fechaFin=${fFin}`)
      .then((data) => {
        if (Array.isArray(data)) {
          setHistorialData(data);
          // Al consultar con rango personalizado, mostramos la agrupación 'dia' (que el backend usa para zoom dinámico)
          setRangoSeleccionado("dia");
        } else {
          setHistorialData([]);
        }
      })
      .catch(() => {
        setHistorialData([]);
        showAlert("error", "Error al consultar los datos del rango seleccionado.");
      })
      .finally(() => setLoading(false));
  };

  // Carga inicial: Último mes por defecto
  useEffect(() => {
    if (userId) {
      const hoy = new Date();
      const inicio = new Date(hoy);
      inicio.setMonth(hoy.getMonth() - 1); // un mes atrás

      const fInicio = inicio.toISOString().split("T")[0];
      const fFin = hoy.toISOString().split("T")[0];
      
      setFechaInicio(fInicio);
      setFechaFin(fFin);
      setRangoSeleccionado("dia");
      
      setLoading(true);
      apiGet(`/electrical_analysis/historial_detallado/${userId}?fechaInicio=${fInicio}&fechaFin=${fFin}`)
        .then((data) => {
          if (Array.isArray(data)) {
            setHistorialData(data);
          } else {
            setHistorialData([]);
          }
        })
        .catch(() => setHistorialData([]))
        .finally(() => setLoading(false));
    }
  }, [userId]);

  // Aplicar rango rápido preestablecido
  const aplicarPresetRango = (rango) => {
    setRangoSeleccionado(rango);
    const hoy = new Date();
    let inicio = new Date(hoy);

    switch (rango) {
      case "dia":
        inicio.setDate(hoy.getDate() - 1);
        break;
      case "semana":
        inicio.setDate(hoy.getDate() - 7);
        break;
      case "mes":
        inicio.setMonth(hoy.getMonth() - 1);
        break;
      case "ano":
        inicio.setFullYear(hoy.getFullYear() - 1);
        break;
      default:
        break;
    }

    const fInicio = inicio.toISOString().split("T")[0];
    const fFin = hoy.toISOString().split("T")[0];
    setFechaInicio(fInicio);
    setFechaFin(fFin);

    fetchHistorialConRango(fInicio, fFin);
  };

  // Consultar manualmente con los calendarios de la UI
  const handleConsultarRangoPersonalizado = () => {
    if (!fechaInicio || !fechaFin) {
      showAlert("error", "Por favor selecciona ambas fechas.");
      return;
    }
    if (new Date(fechaInicio) > new Date(fechaFin)) {
      showAlert("error", "La fecha de inicio no puede ser posterior a la de fin.");
      return;
    }
    fetchHistorialConRango(fechaInicio, fechaFin);
  };

  // Generar reporte PDF
  const generarReporte = () => {
    if (!fechaInicio || !fechaFin) {
      showAlert("error", "Por favor selecciona un rango de fechas.");
      return;
    }

    const body = {
      fechaInicio: `${fechaInicio}T00:00:00Z`,
      fechaFinal: `${fechaFin}T23:59:59Z`,
    };

    apiPost(`/user/reports/${userId}`, body)
      .then((data) => {
        setReporte(data);
        setMostrarReporte(true);
      })
      .catch((err) => {
        console.error("Error al obtener el reporte:", err);
        showAlert("error", "No se pudo generar el reporte PDF.");
      });
  };

  return (
    <div className="historial-page-wrapper">
      {/* Barra superior de Breadcrumbs */}
      <div className="breadcrumb-topbar">
        <Breadcrumb items={breadcrumbItems} />
        <div className="breadcrumb-actions">
          <BackButton onClick={() => navigate("/consumo")} label="Volver" />
        </div>
      </div>

      {/* Encabezado del Historial */}
      <div className="historial-header-banner">
        <h2 className="historial-page-title">Historial de Consumo</h2>
        <p className="historial-page-subtitle">Analiza las mediciones históricas acumuladas y descarga reportes PDF personalizados.</p>
      </div>

      {/* Distribución del Layout en Dos Columnas */}
      <div className="historial-grid-layout">
        
        {/* Columna Izquierda: Filtros y Descargas */}
        <aside className="historial-layout-left">
          
          {/* Botones de presets rápidos */}
          <div className="historial-presets-card">
            <h3 className="panel-title">Presets de Rango</h3>
            <div className="historial-presets-list">
              {rangosDisponibles.map((r) => (
                <button
                  key={r.value}
                  className={`historial-preset-btn ${rangoSeleccionado === r.value ? "active" : ""}`}
                  onClick={() => aplicarPresetRango(r.value)}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tarjeta de Rango Personalizado / Generador PDF */}
          <div className="consumo-glass-panel range-selector-card">
            <h3 className="panel-title">Filtro de Rango</h3>
            
            <div className="date-inputs-container">
              <div className="date-input-group">
                <label htmlFor="fecha-inicio-input">Fecha Inicio</label>
                <input
                  id="fecha-inicio-input"
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="custom-date-input"
                />
              </div>
              
              <div className="date-input-group">
                <label htmlFor="fecha-fin-input">Fecha Término</label>
                <input
                  id="fecha-fin-input"
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="custom-date-input"
                />
              </div>
            </div>

            <div className="action-buttons-stack">
              <button 
                onClick={handleConsultarRangoPersonalizado} 
                className="consultar-btn"
                disabled={loading}
              >
                {loading ? "Cargando..." : "Consultar Rango"}
              </button>
              <button 
                onClick={generarReporte} 
                className="generar-pdf-btn"
                type="button"
              >
                Generar Reporte PDF
              </button>
            </div>

            {fechaInicio && fechaFin && (
              <p className="selected-range-label">
                Rango: <span>{fechaInicio}</span> al <span>{fechaFin}</span>
              </p>
            )}

            {mostrarReporte && reporte && (
              <ModalReporte
                reporte={reporte}
                onClose={() => setMostrarReporte(false)}
              />
            )}
          </div>

        </aside>

        {/* Columna Derecha: Reportes, Gráficas y Mediciones */}
        <main className="historial-layout-right">
          
          {loading ? (
            <div className="historial-loading-container">
              <div className="help-spinner"></div>
              <p>Consultando historial detallado en la red...</p>
            </div>
          ) : rangoSeleccionado ? (
            (() => {
              const item = historialData.find((d) => d.rango === rangoSeleccionado);
              const detalles = item?.detalles || [];

              if (detalles.length === 0) {
                return (
                  <div className="historial-empty-container">
                    <p>⚠️ No hay datos registrados en el rango de fechas seleccionado.</p>
                    <span>Intenta seleccionar otro período de tiempo en los calendarios.</span>
                  </div>
                );
              }

              const promedios = detalles.map((d) => d.promedio);
              const promedioGlobal = (
                promedios.reduce((sum, val) => sum + val, 0) / promedios.length
              ).toFixed(3);
              const min = Math.min(...promedios).toFixed(3);
              const max = Math.max(...promedios).toFixed(3);
              const maxValForGauge = Math.max(...promedios, 0.001);

              return (
                <div className="historial-details-section">
                  
                  {/* Fila de KPI Cards */}
                  <div className="historial-kpi-row">
                    <div className="kpi-mini-card">
                      <span className="kpi-mini-label">Promedio Diario</span>
                      <h4 className="kpi-mini-value">{promedioGlobal} <span className="kpi-mini-unit">kWh</span></h4>
                    </div>
                    <div className="kpi-mini-card glow-blue">
                      <span className="kpi-mini-label">Consumo Mínimo</span>
                      <h4 className="kpi-mini-value">{min} <span className="kpi-mini-unit">kWh</span></h4>
                    </div>
                    <div className="kpi-mini-card glow-orange">
                      <span className="kpi-mini-label">Consumo Máximo</span>
                      <h4 className="kpi-mini-value">{max} <span className="kpi-mini-unit">kWh</span></h4>
                    </div>
                  </div>

                  {/* Tarjeta del Gráfico */}
                  <div className="consumo-glass-panel chart-card">
                    <h3 className="panel-title">Tendencia de Consumo</h3>
                    <div
                      className="chart-container-inner"
                      style={{ cursor: "pointer" }}
                      onClick={() => setModalVisible(true)}
                    >
                      <HistorialLineChart detalles={detalles} />
                    </div>
                  </div>

                  {/* Desglose Detallado */}
                  <div className="consumo-glass-panel breakdown-card">
                    <h3 className="panel-title">Consumo Detallado del Periodo</h3>
                    <div className="breakdown-list">
                      {detalles.map((d, idx) => {
                        const val = d.promedio;
                        const pct = (val / maxValForGauge) * 100;
                        return (
                          <div key={idx} className="breakdown-item">
                            <span className="breakdown-label">
                              <span className="calendar-icon">📅</span>
                              {d.etiqueta}
                            </span>
                            <div className="breakdown-gauge-wrapper">
                              <div className="breakdown-gauge-bar" style={{ width: `${pct}%` }}></div>
                            </div>
                            <span className="breakdown-value">{val.toFixed(3)} kWh</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              );
            })()
          ) : (
            <div className="historial-empty-container">
              <p>💡 Selecciona un preset o ingresa un rango de fechas para consultar el historial.</p>
            </div>
          )}

        </main>
      </div>

      {/* Modal Ampliado de Gráfica */}
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
              backgroundColor: "var(--card-bg, #ffffff)",
              border: "1px solid var(--border-color, #e0e0e0)",
              padding: "24px",
              borderRadius: "16px",
              width: "90%",
              height: "80%",
              boxShadow: "0 12px 36px rgba(0,0,0,0.5)",
              display: "flex",
              flexDirection: "column",
              gap: "16px"
            }}
          >
            <h3 style={{ textAlign: "center", margin: 0, color: "var(--text-primary)" }}>
              Vista ampliada de tendencia
            </h3>
            <div style={{ flex: 1, minHeight: 0 }}>
              <HistorialLineChart
                detalles={
                  historialData.find((d) => d.rango === rangoSeleccionado)
                    ?.detalles || []
                }
                isModal
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistorialPage;
