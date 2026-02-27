import React, { useState } from "react";
import HeaderPW from "../components/LayoutComponents/HeaderPW";
import Sidebar from "../components/LayoutComponents/Sidebar";
import LogoutConfirmModal from "../components/CommonComponents/LogoutConfirmModal";
import { useAuth } from "../context/AuthContext";
import "../styles/LayoutComponentsCss/Sidebar.css";

const AuthenticatedLayoutV3 = ({ 
  children, 
  isModalOpen, 
  onLogout, 
  onConfirm, 
  onCancel,
  pageTitle = "Dashboard" // Título dinámico de la página
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const { name } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const sidebarOffset = isSidebarCollapsed ? "70px" : "250px";

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      height: "100vh",
      backgroundColor: "var(--bg-body)",
      transition: "background-color 0.3s ease",
      "--sidebar-offset": sidebarOffset
    }}>
      {/* Header en la parte superior */}
      <div style={{ position: "relative", zIndex: 100 }}>
        <HeaderPW 
          onLogout={onLogout} 
          userName={name}
          pageTitle={pageTitle}
        />
      </div>

      {/* Sidebar superpuesto + Contenido */}
      <div style={{ 
        flex: 1, 
        overflow: "hidden", 
        position: "relative",
        backgroundColor: "var(--bg-body)",
        transition: "background-color 0.3s ease"
      }}>
        {/* Sidebar fijo desde el tope */}
        <div style={{ 
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          zIndex: 200
        }}>
          <Sidebar 
            isCollapsed={isSidebarCollapsed} 
            toggleSidebar={toggleSidebar} 
            onLogout={onLogout}
          />
        </div>

        {/* Contenido Principal */}
        <main 
          style={{ 
            flex: 1,
            padding: "20px",
            paddingLeft: `calc(${sidebarOffset} + 20px)` ,
            height: "100%",
            minHeight: 0,
            overflowY: "auto",
            backgroundColor: "var(--bg-body)",
            color: "var(--text-primary)",
            transition: "background-color 0.3s ease, color 0.3s ease, padding-left 0.3s ease"
          }}
        >
          {children}
        </main>
      </div>

      {/* Modal de Logout (Global) */}
      {isModalOpen && (
        <LogoutConfirmModal 
          onConfirm={onConfirm} 
          onCancel={onCancel} 
        />
      )}
    </div>
  );
};

export default AuthenticatedLayoutV3;
