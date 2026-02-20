import React, { useState } from "react";
import Sidebar from "../components/LayoutComponents/Sidebar";
import LogoutConfirmModal from "../components/CommonComponents/LogoutConfirmModal";
import "../styles/LayoutComponentsCss/Sidebar.css"; // Asegurarse que los estilos globales carguen

const AuthenticatedLayout = ({ children, isModalOpen, onLogout, onConfirm, onCancel }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar Fijo a la izquierda */}
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        toggleSidebar={toggleSidebar} 
        onLogout={onLogout}
      />

      {/* Contenido Principal */}
      <main 
        style={{ 
          flex: 1, 
          marginLeft: isSidebarCollapsed ? "70px" : "250px", 
          transition: "margin-left 0.3s ease",
          width: "100%",
          paddingTop: "20px"
        }}
      >
        {children}
      </main>

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

export default AuthenticatedLayout;