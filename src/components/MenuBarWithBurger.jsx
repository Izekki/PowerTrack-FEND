import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/MenuBarWithBurger.css";

const MenuBarWithBurger = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Cambia el estado de apertura/cierre del menú
  };

  return (
    <div className={`cont-nav-bar-menubarwithburger ${isMenuOpen ? 'open' : ''}`}>
      <nav className="nav-bar-menubarwithburger">
        {/* Icono de la hamburguesa */}
        <div
          className={`burger-icon-menubarwithburger ${isMenuOpen ? 'open' : ''}`}
          onClick={toggleMenu} // Cambia el estado al hacer clic
        >
          <span className="burger-symbol-menubarwithburger">☰</span>
        </div>
        {/* Elementos del menú, se muestran solo si el menú está abierto */}
        <ul className={`menu-items-menubarwithburger ${isMenuOpen ? 'open' : ''}`}>
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
