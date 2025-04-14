import React from "react";
import { Link } from "react-router-dom";
import "../styles/MenuBar.css";

const MenuBar = () => {
  return (
    <div className="cont-nav-bar">
      <nav className="nav-bar">
        <ul>
          <li><Link to="/consumo">Consumo</Link></li>
          <li><Link to="/alertas">Alertas</Link></li>
          <li><Link to="/dispositivos">Dispositivos</Link></li>
          <li><Link to="/perfil">Mi Perfil</Link></li>
          <li><Link to="/configuracion">Configuración</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default MenuBar;
