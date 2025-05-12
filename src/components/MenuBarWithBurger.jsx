import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/MenuBarWithBurger.css";

const MenuBarWithBurger = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="cont-nav-bar">
      <div className="menu-header">
        <button className="burger-button" onClick={toggleMenu}>
          ☰
        </button>
        <span className="menu-title">PowerTrack</span>
      </div>

      <nav className={`nav-bar ${isOpen ? "open" : ""}`}>
        <ul>
          <li><Link to="/consumo">Consumo</Link></li>
          <li><Link to="/alertas">Alertas</Link></li>
          <li><Link to="/dispositivos">Dispositivos</Link></li>
          <li><Link to="/miperfil">Mi Perfil</Link></li>
          <li><Link to="/configuracion">Configuración</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default MenuBarWithBurger;
