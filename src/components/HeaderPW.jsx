// HeaderPW.jsx
import React, { useState, useEffect } from "react";
import "../styles/HeaderPW.css";
import logo from "../assets/logo-pw.svg";
import dashboardIcon from "../assets/sidebar-icons/dashboard.png";
import consuIcon from "../assets/sidebar-icons/grafico.png";
import devicesIcon from "../assets/sidebar-icons/dispositivos.png";
import alertIcon from "../assets/sidebar-icons/alerta.png";
import profileIcon from "../assets/sidebar-icons/avatar.png";
import configIcon from "../assets/sidebar-icons/ajuste.png";

const getPageIcon = (pageTitle) => {
  const icons = {
    "Dashboard": <img src={dashboardIcon} alt="Dashboard" className="page-icon-img" />,
    "Consumo": <img src={consuIcon} alt="Consumo" className="page-icon-img" />,
    "Dispositivos": <img src={devicesIcon} alt="Dispositivos" className="page-icon-img" />,
    "Alertas": <img src={alertIcon} alt="Alertas" className="page-icon-img" />,
    "Mi Perfil": <img src={profileIcon} alt="Perfil" className="page-icon-img" />,
    "Configuración": <img src={configIcon} alt="Configuración" className="page-icon-img" />,
    "Historial": <img src={dashboardIcon} alt="Historial" className="page-icon-img" />
  };
  return icons[pageTitle] || null;
};

const HeaderPW = ({ userName, pageTitle = "Dashboard" }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCollapsed(true);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  const pageIcon = getPageIcon(pageTitle);
  const isDashboard = pageTitle === "Dashboard";
  const displayText = isCollapsed
    ? pageTitle
    : (isDashboard ? `${pageTitle}, ${userName}` : pageTitle);

  return (
    <header className={`header-pw ${isCollapsed ? "header-collapsed" : ""}`}>
      <div className="header-content">
        {!isCollapsed && (
          <div className="logo-container">
            <img src={logo} alt="Logo" className="logo" />
          </div>
        )}

        {/* Mostrar el título de la página con su icono */}
        <div className="user-info">
          <span className="user-name">
            {pageIcon && <span className="page-icon">{pageIcon}</span>}
            {displayText}
          </span>
        </div>
      </div>
    </header>
  );
};

export default HeaderPW;