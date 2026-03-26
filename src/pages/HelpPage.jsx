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
  const [selectedItem, setSelectedItem] = useState(null);

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
      } catch (error) {
        console.error("Error cargando ayuda:", error);
        setStatus("error");
      }
    };

    loadHelp();
  }, []);

  if (status === "loading") {
    return <p className="help-status">Cargando ayuda...</p>;
  }

  if (status === "error") {
    return <p className="help-status">No se pudo cargar la ayuda.</p>;
  }

  return (
    <div className="help-page-wrapper">
      <div className="help-page-content">
        <div className="breadcrumb-topbar">
          <Breadcrumb items={breadcrumbItems} />
          <div className="breadcrumb-actions">
            <BackButton onClick={() => navigate("/configuracion")} label="Volver" />
          </div>
        </div>
        <div className="help-page-container">
          <div className="help-grid">
            {sections.map((section) => (
            <article key={section.id} className="help-card">
              <h3 className="help-card-title">{section.title}</h3>
              <div className="help-buttons-list">
                {section.guides.map((guide, index) => (
                  <button
                    key={`${section.id}-${index}`}
                    className={`help-item-button ${
                      selectedItem === `${section.id}-${index}` ? "active" : ""
                    }`}
                    onClick={() =>
                      setSelectedItem(
                        selectedItem === `${section.id}-${index}`
                          ? null
                          : `${section.id}-${index}`
                      )
                    }
                  >
                    {guide}
                  </button>
                ))}
              </div>
            </article>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
