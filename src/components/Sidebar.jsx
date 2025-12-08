import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";
import { useAlert } from "../context/AlertContext";

// Importación de iconos (Asegúrate de tener estos o usa los que ya tienes)
import logo from "../assets/logo-pw.svg";
import homeIcon from "../assets/sidebar-icons/home.png"; // Usando speedometer como Home temporal o si tienes un icono de casa
import devicesIcon from "../assets/sidebar-icons/dispositivos.png"; // Icono genérico de devices
import alertsIcon from "../assets/sidebar-icons/alerta.png";
import configIcon from "../assets/sidebar-icons/ajuste.png";
import logoutIcon from "../assets/sidebar-icons/salida.png";
// Iconos inline para Home y Stats si no existen en assets
const HomeSvg = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const ChartSvg = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>;
const GridSvg = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;


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
              <span className="icon"><HomeSvg /></span>
              <span className="label">Inicio</span>
            </Link>
          </li>
          <li>
            <Link to="/consumo" className={`nav-item ${isActive("/consumo") ? "active" : ""}`}>
              <span className="icon"><ChartSvg /></span>
              <span className="label">Consumo</span>
            </Link>
          </li>
          <li>
            <Link to="/dispositivos" className={`nav-item ${isActive("/dispositivos") ? "active" : ""}`}>
              <span className="icon"><GridSvg /></span>
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