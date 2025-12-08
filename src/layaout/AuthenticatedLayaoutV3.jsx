import React, { useState } from "react";
import HeaderPW from "../components/HeaderPW";
import Sidebar from "../components/Sidebar";
import LogoutConfirmModal from "../components/LogoutConfirmModal";
import { useAuth } from "../context/AuthContext";
import "../styles/Sidebar.css";

const AuthenticatedLayoutV3 = ({ 
  children, 
  isModalOpen, 
  onLogout, 
  onConfirm, 
  onCancel,
  pageTitle = "Bienvenido" // Título dinámico de la página
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const { name } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      height: "100vh",
      backgroundColor: "var(--bg-body)",
      transition: "background-color 0.3s ease"
    }}>
      {/* Header en la parte superior - fijo */}
      <div style={{ position: "relative", zIndex: 100 }}>
        <HeaderPW 
          onLogout={onLogout} 
          userName={name}
          pageTitle={pageTitle}
        />
      </div>

      {/* Contenedor de Sidebar + Contenido */}
      <div style={{ 
        display: "flex", 
        flex: 1, 
        overflow: "hidden", 
        position: "relative",
        backgroundColor: "var(--bg-body)",
        transition: "background-color 0.3s ease"
      }}>
        {/* Sidebar Fijo a la izquierda - DEBAJO del header */}
        <div style={{ 
          position: "relative",
          zIndex: 50
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
            overflowY: "auto",
            backgroundColor: "var(--bg-body)",
            color: "var(--text-primary)",
            transition: "background-color 0.3s ease, color 0.3s ease"
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
