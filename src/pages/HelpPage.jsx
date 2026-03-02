import React, { useEffect, useState } from "react";
import "../styles/HelpPage.css";
import { getHelpSections } from "../utils/services/helpService";

const HelpPage = () => {
  const [sections, setSections] = useState([]);
  const [status, setStatus] = useState("loading");

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
    <div className="help-page-container">
      <div className="help-grid">
        {sections.map((section) => (
          <article key={section.id} className="help-card">
            <h3 className="help-card-title">{section.title}</h3>
            <ul className="help-list">
              {section.guides.map((guide, index) => (
                <li key={`${section.id}-${index}`}>{guide}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
};

export default HelpPage;
