import React, { useEffect, useState } from "react";
import "../styles/ConfigurationPage.css";
import AccessibilityCard from "../components/ConfigPageComponents/AccessibilityCard";
import { useAuth } from "../context/AuthContext";
import { useContrast } from "../context/ContrastContext";
import { useNavigate } from "react-router-dom";


const ConfigurationPage = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const { themePreference, handleThemePreferenceChange } = useContrast();
  const [selectedTheme, setSelectedTheme] = useState(themePreference);
  const [activeCard, setActiveCard] = useState(null);

  useEffect(() => {
    setSelectedTheme(themePreference);
  }, [themePreference]);

  const handleThemeChange = async (event) => {
    const newTheme = event.target.value;
    setSelectedTheme(newTheme);
    await handleThemePreferenceChange(newTheme, userId);
  };

  const cards = [
    {
      title: "Ayuda y Comentarios",
      text: "Aquí encontrarás acceso a ayuda rápida y espacio para comentarios de mejora.",
      key: "ayuda",
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
      if (key === "ayuda") {
        navigate("/ayuda");
        return;
      }
      if (key === "contacto") {
        navigate("/contacto");
        return;
      }
      setActiveCard(key);
  };

  return (
    <div className="configurationPage-container">
      {/*<h2 className="configurationPage-title">Configuración</h2>*/}
      <div className="configurationPage-content">
        <AccessibilityCard
          selectedTheme={selectedTheme}
          handleThemeChange={handleThemeChange}
        />

        {cards.map((card) => (
          <React.Fragment key={card.title}>
            <button
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

          </React.Fragment>
        ))}

      </div>
    </div>
  );
};

export default ConfigurationPage;
