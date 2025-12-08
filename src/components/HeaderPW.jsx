// HeaderPW.jsx
import "../styles/HeaderPW.css";
import logo from "../assets/logo-pw.svg";
<<<<<<< Updated upstream

const HeaderPW = ({ onLogout, userName }) => {
=======
import homeIcon from "../assets/sidebar-icons/home.png";
import consuIcon from "../assets/sidebar-icons/grafico.png";
import devicesIcon from "../assets/sidebar-icons/dispositivos.png";
import alertIcon from "../assets/sidebar-icons/alerta.png";
import profileIcon from "../assets/sidebar-icons/avatar.png";
import configIcon from "../assets/sidebar-icons/ajuste.png";

// Función para obtener el icono según el título de la página
const getPageIcon = (pageTitle) => {
  const icons = {
    "Bienvenido": <img src={homeIcon} alt="Home" className="page-icon-img" />,
    "Consumo": <img src={consuIcon} alt="Consumo" className="page-icon-img" />,
    "Dispositivos": <img src={devicesIcon} alt="Dispositivos" className="page-icon-img" />,
    "Alertas": <img src={alertIcon} alt="Alertas" className="page-icon-img" />,
    "Mi Perfil": <img src={profileIcon} alt="Perfil" className="page-icon-img" />,
    "Configuración": <img src={configIcon} alt="Configuración" className="page-icon-img" />,
    "Historial": <img src={homeIcon} alt="Historial" className="page-icon-img" />
  };
  return icons[pageTitle] || null;
};

const HeaderPW = ({ userName, pageTitle = "Bienvenido" }) => {
  const pageIcon = getPageIcon(pageTitle);
  
>>>>>>> Stashed changes
  return (
    <header className="header-pw">
      <div className="header-content">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </div>

        {/* Mostrar el nombre del usuario */}
        <div className="user-info">
          <span className="user-name">Bienvenido, {userName}</span>
        </div>

        <div className="logout" onClick={onLogout} style={{ cursor: "pointer" }}>
          Cerrar Sesión
          <svg
            className="logout-icon"
            fill="#fff"
            height="25px"
            width="25px"
            viewBox="0 0 490.3 490.3"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0,121.05v248.2c0,34.2,27.9,62.1,62.1,62.1h200.6c34.2,0,62.1-27.9,62.1-62.1v-40.2c0-6.8-5.5-12.3-12.3-12.3 
            s-12.3,5.5-12.3,12.3v40.2c0,20.7-16.9,37.6-37.6,37.6H62.1c-20.7,0-37.6-16.9-37.6-37.6v-248.2c0-20.7,16.9-37.6,37.6-37.6h200.6 
            c20.7,0,37.6,16.9,37.6,37.6v40.2c0,6.8,5.5,12.3,12.3,12.3s12.3-5.5,12.3-12.3v-40.2c0-34.2-27.9-62.1-62.1-62.1H62.1 
            C27.9,58.95,0,86.75,0,121.05z"></path>
            <path d="M385.4,337.65c2.4,2.4,5.5,3.6,8.7,3.6s6.3-1.2,8.7-3.6l83.9-83.9c4.8-4.8,4.8-12.5,0-17.3l-83.9-83.9 
            c-4.8-4.8-12.5-4.8-17.3,0s-4.8,12.5,0,17.3l63,63H218.6c-6.8,0-12.3,5.5-12.3,12.3c0,6.8,5.5,12.3,12.3,12.3h229.8l-63,63 
            C380.6,325.15,380.6,332.95,385.4,337.65z"></path>
          </svg>
        </div>
      </div>
    </header>
  );
};

export default HeaderPW;
