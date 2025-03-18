import React from "react";
import "../styles/MenuBar.css";

const MenuBar = () => {
  return (
    <div className="cont-nav-bar">
      <nav className="nav-bar">
        <ul>
          <li>Consumo</li>
          <li>Alertas</li>
          <li>Dispositivos</li>
          <li>Mi Perfil</li>
          <li>Configuración</li>
        </ul>
    </nav>
    </div>
  );
};

export default MenuBar