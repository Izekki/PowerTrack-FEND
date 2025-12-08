import React, { use } from "react";
import HeaderPW from "../components/HeaderPW";
import MenuBar from "../components/MenuBar";
import LogoutConfirmModal from "../components/LogoutConfirmModal";
import MenuBarWithBurger from "../components/MenuBarWithBurger";
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