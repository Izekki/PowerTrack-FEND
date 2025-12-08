// HeaderPW.jsx
import "../styles/HeaderPW.css";
import logo from "../assets/logo-pw.svg";
import alertIcon from "../assets/sidebar-icons/alerta.png";
import configIcon from "../assets/sidebar-icons/ajuste.png";

// Iconos SVG inline
const HomeSvg = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const ChartSvg = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>;
const GridSvg = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;
const UserSvg = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const HistorySvg = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M12 7v5l4 2"></path></svg>;

// Función para obtener el icono según el título de la página
const getPageIcon = (pageTitle) => {
  const icons = {
    "Bienvenido": <HomeSvg />,
    "Consumo": <ChartSvg />,
    "Dispositivos": <GridSvg />,
    "Alertas": <img src={alertIcon} alt="Alertas" className="page-icon-img" />,
    "Mi Perfil": <UserSvg />,
    "Configuración": <img src={configIcon} alt="Configuración" className="page-icon-img" />,
    "Historial": <HistorySvg />
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
