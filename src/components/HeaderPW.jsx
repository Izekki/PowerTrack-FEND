// HeaderPW.jsx
import "../styles/HeaderPW.css";
import logo from "../assets/logo-pw.svg";
const HeaderPW = ({ onLogout, userName }) => {
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
  return (
    <header className="header-pw">
      <div className="header-content">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </div>

        {/* Mostrar el título de la página con su icono */}
        <div className="user-info">
          <span className="user-name">
            {pageIcon && <span className="page-icon">{pageIcon}</span>}
            {pageTitle === "Bienvenido" ? `${pageTitle}, ${userName}` : pageTitle}
          </span>
        </div>
      </div>
    </header>
  );
};

export default HeaderPW;
