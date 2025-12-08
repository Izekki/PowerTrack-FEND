import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";
import { useAlert } from "../context/AlertContext";

// Importación de iconos 
import logo from "../assets/logo-pw.svg";
import homeIcon from "../assets/sidebar-icons/home.png"; 
import devicesIcon from "../assets/sidebar-icons/dispositivos.png"; 
import alertsIcon from "../assets/sidebar-icons/alerta.png";
import configIcon from "../assets/sidebar-icons/ajuste.png";
import logoutIcon from "../assets/sidebar-icons/salida.png";
import consuIcon from "../assets/sidebar-icons/grafico.png";
import profileIcon from "../assets/sidebar-icons/avatar.png";
// Iconos inline para Home y Stats si no existen en assets

const Sidebar = ({ isCollapsed, toggleSidebar, onLogout }) => {
  const location = useLocation();
  const { hasNewAlerts } = useAlert();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : "expanded"}`}>
      {/* Header del Sidebar (Logo y botón hamburguesa) */}
      <div className="sidebar-header">
        <div className="logo-area">
           {!isCollapsed && <img src={logo} alt="PowerTrack" className="sidebar-logo" />}
        </div>
        <button className="burger-btn" onClick={toggleSidebar}>
          ☰
        </button>
      </div>

      {/* Navegación */}
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/home" className={`nav-item ${isActive("/home") ? "active" : ""}`}>
              <img src={homeIcon} alt="Home" className="icon-img"/>
              <span className="label">Inicio</span>
            </Link>
          </li>
          <li>
            <Link to="/consumo" className={`nav-item ${isActive("/consumo") ? "active" : ""}`}>
              <img src={consuIcon} alt="Consumo" className="icon-img"/>
              <span className="label">Consumo</span>
            </Link>
          </li>
          <li>
            <Link to="/dispositivos" className={`nav-item ${isActive("/dispositivos") ? "active" : ""}`}>
              <img src={devicesIcon} alt="Dispositivos" className="icon-img"/>
              <span className="label">Dispositivos</span>
            </Link>
          </li>
          <li>
            <Link to="/alertas" className={`nav-item ${isActive("/alertas") ? "active" : ""}`}>
              <span className="icon-wrapper">
                 <img src={alertsIcon} alt="Alertas" className="icon-img"/>
                 {hasNewAlerts && <span className="notification-dot"></span>}
              </span>
              <span className="label">Alertas</span>
            </Link>
          </li>
          <li>
            <Link to="/miperfil" className={`nav-item ${isActive("/miperfil") ? "active" : ""}`}>
              <img src={profileIcon} alt="Mi Perfil" className="icon-img"/>
              <span className="label">Mi Perfil</span>
            </Link>
          </li>
          <li>
            <Link to="/configuracion" className={`nav-item ${isActive("/configuracion") ? "active" : ""}`}>
              <img src={configIcon} alt="Config" className="icon-img"/>
              <span className="label">Configuración</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Footer del Sidebar (Logout) */}
      <div className="sidebar-footer">
         <button onClick={onLogout} className="nav-item logout-btn">
            <img src={logoutIcon} alt="Logout" className="icon-img" />
            <span className="label">Salir</span>
         </button>
      </div>
    </aside>
  );
};

export default Sidebar;