import React, { useEffect, useState } from "react";
import "../styles/ConfigurationPage.css";
import AccessibilityCard from "../components/ConfigPageComponents/AccessibilityCard";
import { useTheme } from "next-themes";
import { getHelpSections } from "../utils/services/helpService";


const ConfigurationPage = () => {
  const { theme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [activeCard, setActiveCard] = useState(null);
  const [helpStatus, setHelpStatus] = useState("idle");
  const [helpSections, setHelpSections] = useState([]);

  useEffect(() => {
    setSelectedTheme(theme);
  }, [theme]);

  const handleThemeChange = (event) => {
    const newTheme = event.target.value;
    setTheme(newTheme);
    setSelectedTheme(newTheme);
  };

  const cards = [
    {
      title: "Ayuda y Comentarios",
      text: "Aquí encontrarás acceso a ayuda rápida y espacio para comentarios de mejora.",
      key: "ayuda",
    },
    {
      title: "Contraste",
      text: "Configura opciones visuales de contraste para mejorar la legibilidad de la interfaz.",
      key: "contraste",
    },
    {
      title: "Contacto",
      text: "Revisa la información de contacto para soporte y atención de incidencias.",
      key: "contacto",
    },
    {
      title: "Fecha de corte",
      text: "Define la fecha base para el seguimiento mensual de consumo y alertas.",
      key: "fecha-corte",
    },
  ];

  const openCard = async (key) => {
    setActiveCard(key);

    if (key !== "ayuda" || helpStatus === "success" || helpStatus === "loading") {
      return;
    }

    try {
      setHelpStatus("loading");
      const data = await getHelpSections();
      setHelpSections(data);
      setHelpStatus("success");
    } catch (error) {
      console.error("Error cargando ayuda:", error);
      setHelpStatus("error");
    }
  };

  return (
    <div className="configurationPage-container">
      <h2 className="configurationPage-title">Configuración</h2>
      <div className="configurationPage-content">
        <AccessibilityCard
          selectedTheme={selectedTheme}
          handleThemeChange={handleThemeChange}
        />

        {cards.map((card) => (
          <button
            key={card.title}
            type="button"
            className={`configurationCard configurationCard-button ${
              activeCard === card.key ? "active" : ""
            }`}
            onClick={() => openCard(card.key)}
          >
            <div className="configurationCard-headerInline">
              <h3 className="configurationCard-title">{card.title}</h3>
              {card.key === "ayuda" && (
                <span
                  className="configuration-help-icon"
                  aria-hidden="true"
                />
              )}
            </div>
            <p className="configurationCard-text">{card.text}</p>
          </button>
        ))}

        {activeCard === "ayuda" && (
          <div className="configurationCard">
            <h3 className="configurationCard-title">Ayudas disponibles</h3>

            {helpStatus === "loading" && (
              <p className="configurationCard-text">Cargando ayudas...</p>
            )}

            {helpStatus === "error" && (
              <p className="configurationCard-text">
                No se pudo cargar la ayuda por el momento.
              </p>
            )}

            {helpStatus === "success" && (
              <div className="configuration-help-grid">
                {helpSections.map((section) => (
                  <div key={section.id} className="configuration-help-item">
                    <h4>{section.title}</h4>
                    <ul>
                      {section.guides.map((guide, index) => (
                        <li key={`${section.id}-${index}`}>{guide}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfigurationPage;
