import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { apiPost } from "../utils/apiHelper";
import { showAlert } from "../components/CommonComponents/Alert";
import BackButton from "../components/CommonComponents/BackButton";
import Breadcrumb from "../components/CommonComponents/Breadcrumb";
import "../styles/FechaCortePage.css";

const FechaCortePage = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [fechaCorte, setFechaCorte] = useState("");
  const [loading, setLoading] = useState(false);

  const breadcrumbItems = [
    { label: "Configuración", onClick: () => navigate("/configuration") },
    { label: "Fecha de Corte", active: true }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!fechaCorte) {
      showAlert("error", "Por favor selecciona una fecha de corte");
      return;
    }

    setLoading(true);

    try {
      const body = {
        userId: userId,
        fechaCorte: fechaCorte
      };

      await apiPost(`/user/fecha-corte`, body);
      
      showAlert("success", "Fecha de corte guardada exitosamente");
      setFechaCorte("");
    } catch (error) {
      console.error("Error al guardar fecha de corte:", error);
      showAlert("error", "Ocurrió un error al guardar la fecha de corte");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fecha-corte-page">
      <div className="breadcrumb-topbar">
        <Breadcrumb items={breadcrumbItems} />
        <div className="breadcrumb-actions">
          <BackButton 
            className="btn-close-edit" 
            onClick={() => navigate("/configuration")} 
          />
        </div>
      </div>

      <div className="fecha-corte-card">
        <div className="fecha-corte-container">
          {/* COLUMNA IZQUIERDA - Formulario */}
          <div className="columna-izquierda">
            <div className="form-container">
              <h2 className="page-title">Configurar Fecha de Corte</h2>
              <p className="page-description">
                Define la fecha base para el seguimiento mensual de consumo y alertas. 
                Esta fecha se utilizará como referencia para calcular los ciclos de facturación.
              </p>

              <form onSubmit={handleSubmit} className="corte-form">
                <div className="form-group">
                  <label htmlFor="fechaCorte" className="form-label">
                    Fecha de Corte de Luz
                  </label>
                  <input
                    type="date"
                    id="fechaCorte"
                    value={fechaCorte}
                    onChange={(e) => setFechaCorte(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-info">
                  <p>💡 <strong>Nota:</strong> La fecha de corte se establece el día del mes (1-31) en que se realiza la lectura del medidor.</p>
                </div>

                <button 
                  type="submit" 
                  className="save-btn"
                  disabled={loading}
                >
                  {loading ? "Guardando..." : "Guardar Fecha de Corte"}
                </button>
              </form>
            </div>
          </div>

          {/* COLUMNA DERECHA - Información adicional */}
          <div className="columna-derecha">
            <div className="info-card">
              <h3 className="info-title">¿Qué es la Fecha de Corte?</h3>
              <p className="info-text">
                La fecha de corte es el día específico del mes en que se realiza la lectura 
                del medidor de luz y se calcula el consumo para facturación.
              </p>
            </div>

            <div className="info-card">
              <h3 className="info-title">Beneficios</h3>
              <ul className="info-list">
                <li>Seguimiento mensual preciso del consumo</li>
                <li>Alertas programadas según tu ciclo de facturación</li>
                <li>Reportes consistentes y organizados</li>
                <li>Fácil comparación entre ciclos</li>
              </ul>
            </div>

            <div className="info-card">
              <h3 className="info-title">Consejos</h3>
              <p className="info-text">
                Selecciona un día cercano a la fecha real de lectura de tu medidor 
                para obtener los datos más precisos. Puedes cambiarla en cualquier momento.
              </p>
            </div>

            <div className="tips-card">
              <h3 className="info-title">Tip Extra</h3>
              <p className="info-text">
                Una vez configurada la fecha de corte, el sistema te enviará alertas 
                automáticas unos días antes para que revises tu consumo y evites sorpresas en tu factura.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FechaCortePage;
