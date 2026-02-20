import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../../styles/LayoutComponentsCss/Sidebar.css";
import { useAlert } from "../../context/AlertContext";

// Importación de iconos 
import logo from "../../assets/logo-pw.svg";
import devicesIcon from "../../assets/sidebar-icons/dispositivos.png"; 
import alertsIcon from "../../assets/sidebar-icons/alerta.png";
import configIcon from "../../assets/sidebar-icons/ajuste.png";
import logoutIcon from "../../assets/sidebar-icons/salida.png";
import consuIcon from "../../assets/sidebar-icons/grafico.png";
import profileIcon from "../../assets/sidebar-icons/avatar.png";
import dashboardIcon from "../../assets/sidebar-icons/dashboard.png";
// Iconos inline para Dashboard y Stats si no existen en assets

const Sidebar = ({ isCollapsed, toggleSidebar, onLogout }) => {
  const location = useLocation();
  const { hasNewAlerts } = useAlert();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : "expanded"}`}>
      {/* Header del Sidebar (Logo y botón hamburguesa) */}
      <div className="sidebar-header">
        <div className="logo-area">
           <img src={logo} alt="PowerTrack" className="sidebar-logo" />
           {!isCollapsed && <span className="sidebar-title">Power Track</span>}
        </div>
        <button
          className="burger-btn"
          onClick={toggleSidebar}
          title={isCollapsed ? "Expandir menú" : "Contraer menú"}
          aria-label={isCollapsed ? "Expandir menú" : "Contraer menú"}
        >
          ☰
        </button>
      </div>

      {/* Navegación */}
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link
              to="/dashboard"
              className={`nav-item ${isActive("/dashboard") ? "active" : ""}`}
              title="Dashboard"
              aria-label="Dashboard"
            >
              <img src={dashboardIcon} alt="Dashboard" className="icon-img" />
              <span className="label">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              to="/consumo"
              className={`nav-item ${isActive("/consumo") ? "active" : ""}`}
              title="Consumo"
              aria-label="Consumo"
            >
              <img src={consuIcon} alt="Consumo" className="icon-img" />
              <span className="label">Consumo</span>
            </Link>
          </li>
          <li>
            <Link
              to="/dispositivos"
              className={`nav-item ${isActive("/dispositivos") ? "active" : ""}`}
              title="Dispositivos"
              aria-label="Dispositivos"
            >
              <img src={devicesIcon} alt="Dispositivos" className="icon-img" />
              <span className="label">Dispositivos</span>
            </Link>
          </li>
          <li>
            <Link
              to="/alertas"
              className={`nav-item ${isActive("/alertas") ? "active" : ""}`}
              title="Alertas"
              aria-label="Alertas"
            >
              <span className="icon-wrapper">
                 <img src={alertsIcon} alt="Alertas" className="icon-img" />
                 {hasNewAlerts && <span className="notification-dot"></span>}
              </span>
              <span className="label">Alertas</span>
            </Link>
          </li>
          <li>
            <Link
              to="/miperfil"
              className={`nav-item ${isActive("/miperfil") ? "active" : ""}`}
              title="Mi perfil"
              aria-label="Mi perfil"
            >
              <img src={profileIcon} alt="Mi perfil" className="icon-img" />
              <span className="label">Mi Perfil</span>
            </Link>
          </li>
          <li>
            <Link
              to="/configuracion"
              className={`nav-item ${isActive("/configuracion") ? "active" : ""}`}
              title="Configuración"
              aria-label="Configuración"
            >
              <img src={configIcon} alt="Configuración" className="icon-img" />
              <span className="label">Configuración</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Footer del Sidebar (Logout) */}
      <div className="sidebar-footer">
        <button
          onClick={onLogout}
          className="nav-item logout-btn"
          title="Salir"
          aria-label="Salir"
        >
          <img src={logoutIcon} alt="Salir" className="icon-img" />
            <span className="label">Salir</span>
         </button>
      </div>
    </aside>
  );
};

export default Sidebar;