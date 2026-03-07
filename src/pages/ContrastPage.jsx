import React from "react";
import { useContrast } from "../context/ContrastContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/ContrastPage.css";
import BackButton from "../components/CommonComponents/BackButton";
import Breadcrumb from "../components/CommonComponents/Breadcrumb";

const ContrastPage = () => {
  const { contrastLevel, handleContrastChange } = useContrast();
  const { userId } = useAuth();
  const navigate = useNavigate();

  const breadcrumbItems = [
    { label: "Configuracion", onClick: () => navigate("/configuracion") },
    { label: "Contraste", active: true },
  ];

  const contrastOptions = [
    {
      id: "normal",
      label: "Contraste Normal",
      description:
        "Contraste estándar de la aplicación. Modo por defecto para visibilidad normal.",
    },
    {
      id: "high",
      label: "Contraste Alto",
      description:
        "Aumenta el contraste entre elementos para mejorar la legibilidad. Recomendado para usuarios con visión reducida.",
    },
    {
      id: "very-high",
      label: "Contraste Muy Alto",
      description:
        "Contraste máximo con colores más vibrantes y bordes más definidos. Para máxima accesibilidad.",
    },
  ];

  return (
    <div className="contrastPage-container">
      <div className="breadcrumb-topbar">
        <Breadcrumb items={breadcrumbItems} />
        <div className="breadcrumb-actions">
          <BackButton onClick={() => navigate("/configuracion")} label="Volver" />
        </div>
      </div>

      <div className="contrastPage-content">
        <h1 className="contrastPage-title">Opciones de Contraste</h1>
        <p className="contrastPage-description">
          Elige el nivel de contraste que mejor se adapte a tus necesidades. Los cambios
          se aplicarán inmediatamente en toda la aplicación.
        </p>

        <div className="contrastOptions-container">
          {contrastOptions.map((option) => (
            <div
              key={option.id}
              className={`contrastOption-card ${
                contrastLevel === option.id ? "active" : ""
              }`}
            >
              <label className="contrastOption-label">
                <input
                  type="radio"
                  name="contrast"
                  value={option.id}
                  checked={contrastLevel === option.id}
                  onChange={(e) => handleContrastChange(e.target.value, userId)}
                  className="contrastOption-input"
                />
                <span className="contrastOption-title">{option.label}</span>
              </label>
              <p className="contrastOption-description">{option.description}</p>

              {/* Vista previa del contraste */}
              <div className={`contrastPreview contrast-preview-${option.id}`}>
                <div className="contrastPreview-text">Texto de vista previa</div>
                <div className="contrastPreview-button">Botón de ejemplo</div>
                <div className="contrastPreview-input">
                  <input
                    type="text"
                    placeholder="Campo de entrada"
                    disabled
                    className="contrastPreview-field"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="contrastInfo-section">
          <h2>Información sobre accesibilidad</h2>
          <div className="contrastInfo-grid">
            <div className="contrastInfo-item">
              <h3>¿Por qué es importante?</h3>
              <p>
                El contraste adecuado mejora la legibilidad para personas con baja visión
                o sensibilidad a la luz. También beneficia a todos en ambientes con mucha
                luz natural.
              </p>
            </div>
            <div className="contrastInfo-item">
              <h3>¿Cuándo usarlo?</h3>
              <p>
                Si tienes dificultad para leer el texto normal, o si trabajas en un entorno
                muy iluminado, activa el contraste alto o muy alto según tus preferencias.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContrastPage;
