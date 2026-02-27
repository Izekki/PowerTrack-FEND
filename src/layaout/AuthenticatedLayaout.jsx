import React from "react";
import HeaderPW from "../components/LayoutComponents/HeaderPW";
import MenuBar from "../components/LayoutComponents/MenuBar";
import LogoutConfirmModal from "../components/CommonComponents/LogoutConfirmModal";
import { useAuth } from "../context/AuthContext";

const AuthenticatedLayout = ({ children, onLogout, isModalOpen, onConfirm, onCancel }) => {

  const {name} = useAuth();
  
  return (
    <>
      <HeaderPW onLogout={onLogout} userName={name} />
      {children}

      {isModalOpen && (
        <LogoutConfirmModal 
          onConfirm={onConfirm} 
          onCancel={onCancel} 
        />
      )}
    </>
  );
};

export default AuthenticatedLayout;