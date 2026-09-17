import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HelpPage.css";
import { getHelpSections } from "../utils/services/helpService";
import BackButton from "../components/CommonComponents/BackButton";
import Breadcrumb from "../components/CommonComponents/Breadcrumb";

const HelpPage = () => {
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [status, setStatus] = useState("loading");
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const breadcrumbItems = [
    { label: "Configuración", onClick: () => navigate("/configuracion") },
    { label: "Ayuda", active: true }
  ];

  useEffect(() => {
    const loadHelp = async () => {
      try {
        setStatus("loading");
        const data = await getHelpSections();
        setSections(data);
        setStatus("success");
        // Seleccionar la primera guía por defecto si hay datos
        if (data.length > 0 && data[0].guides.length > 0) {
          setSelectedGuide(data[0].guides[0]);
        }
      } catch (error) {
        console.error("Error cargando ayuda:", error);
        setStatus("error");
      }
    };

    loadHelp();
  }, []);

  if (status === "loading") {
    return (
      <div className="help-loading-container">
        <div className="help-spinner"></div>
        <p className="help-status">Cargando ayuda de PowerTrack...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="help-error-container">
        <p className="help-status">⚠️ No se pudo cargar la ayuda. Por favor, intenta de nuevo.</p>
        <button onClick={() => window.location.reload()} className="help-retry-btn">
          Reintentar
        </button>
      </div>
    );
  }

  // Filtrado de guías basado en la búsqueda
  const allGuides = sections.flatMap((section) =>
    section.guides.map((guide) => ({
      ...guide,
      category: section.title,
      categoryId: section.id
    }))
  );

  const filteredGuides = searchQuery.trim() === ""
    ? []
    : allGuides.filter(
        (guide) =>
          guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          guide.steps.some((step) => step.text.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  const handleSelectGuide = (guide) => {
    setSelectedGuide(guide);
    // En móviles/pantallas pequeñas, desplazarse suavemente al panel de detalles
    const detailPanel = document.getElementById("help-detail-panel");
    if (detailPanel) {
      detailPanel.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="help-page-wrapper">
      <div className="help-page-content">
        {/* Barra superior con Breadcrumbs y Botón Atrás */}
        <div className="breadcrumb-topbar">
          <Breadcrumb items={breadcrumbItems} />
          <div className="breadcrumb-actions">
            <BackButton onClick={() => navigate("/configuracion")} label="Volver" />
          </div>
        </div>

        {/* Banner de búsqueda con degradado */}
        <div className="help-hero-banner">
          <h1>¿Cómo podemos ayudarte hoy?</h1>
          <p>Busca guías paso a paso o navega por categorías para conocer el uso de PowerTrack.</p>
          <div className="help-search-box">
            <input
              type="text"
              placeholder="Buscar temas de ayuda, palabras clave..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="help-search-input"
            />
            {searchQuery && (
              <button className="help-search-clear" onClick={() => setSearchQuery("")}>
                ✖
              </button>
            )}
          </div>
        </div>

        {/* Contenedor Principal en 2 columnas */}
        <div className="help-main-layout">
          
          {/* Panel Izquierdo: Lista de Categorías o Resultados de Búsqueda */}
          <div className="help-left-pane">
            {searchQuery.trim() !== "" ? (
              // Resultados de la búsqueda
              <div className="search-results-container">
                <h2 className="section-subtitle">Resultados de búsqueda ({filteredGuides.length})</h2>
                {filteredGuides.length > 0 ? (
                  <div className="search-results-list">
                    {filteredGuides.map((guide, idx) => (
                      <button
                        key={`search-res-${idx}`}
                        className={`search-result-item ${
                          selectedGuide?.title === guide.title ? "active" : ""
                        }`}
                        onClick={() => handleSelectGuide(guide)}
                      >
                        <span className="search-result-category">{guide.category}</span>
                        <span className="search-result-title">{guide.title}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="search-empty-state">
                    <p>No encontramos resultados para "{searchQuery}".</p>
                    <span>Prueba con palabras como "dispositivo", "perfil", "alerta" o "contraseña".</span>
                  </div>
                )}
              </div>
            ) : (
              // Vista por categorías
              <div className="help-categories-grid">
                {sections.map((section) => (
                  <article key={section.id} className="help-category-card">
                    <h3 className="help-category-title">{section.title}</h3>
                    <div className="help-guides-list">
                      {section.guides.map((guide, idx) => (
                        <button
                          key={`${section.id}-${idx}`}
                          className={`help-guide-link ${
                            selectedGuide?.title === guide.title ? "active" : ""
                          }`}
                          onClick={() => handleSelectGuide(guide)}
                        >
                          <span className="guide-dot">•</span>
                          <span className="guide-title-text">{guide.title}</span>
                        </button>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* Panel Derecho: Detalle de la Guía Seleccionada */}
          <div id="help-detail-panel" className="help-right-pane">
            {selectedGuide ? (
              <div className="help-guide-detail">
                <div className="guide-detail-header">
                  <span className="guide-detail-badge">Guía Oficial</span>
                  <h2>{selectedGuide.title}</h2>
                  {selectedGuide.description && (
                    <p className="guide-detail-description">{selectedGuide.description}</p>
                  )}
                </div>

                {selectedGuide.steps && selectedGuide.steps.length > 0 ? (
                  <div className="guide-detail-steps">
                    <h3>Pasos para realizar la acción:</h3>
                    <ol className="steps-list">
                      {selectedGuide.steps.map((step, idx) => {
                        // Limpiar formato markdown simple si existe (**texto**)
                        const formattedStep = step.text.replace(/\*\*(.*?)\*\*/g, "$1");
                        return (
                          <li key={`step-${idx}`} className="step-item">
                            <span className="step-number">{idx + 1}</span>
                            <div className="step-content-wrapper">
                              <p className="step-text">{formattedStep}</p>
                              {step.image && (
                                <div className="step-image-container">
                                  <img src={step.image} alt="Referencia visual" className="step-reference-image" />
                                  <span className="step-image-label">Icono en menú</span>
                                </div>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                ) : (
                  <div className="guide-detail-no-steps">
                    <p>Esta guía no tiene pasos detallados disponibles.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="help-detail-placeholder">
                <div className="placeholder-icon">💡</div>
                <h3>Selecciona una guía</h3>
                <p>Elige cualquier guía del panel izquierdo para ver la descripción y los pasos secuenciales.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default HelpPage;
