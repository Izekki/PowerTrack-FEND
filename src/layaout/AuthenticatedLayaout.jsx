import React from "react";
import HeaderPW from "../components/HeaderPW";
import MenuBar from "../components/MenuBar";
import LogoutConfirmModal from "../components/LogoutConfirmModal";

const AuthenticatedLayout = ({ children, onLogout, isModalOpen, onConfirm, onCancel }) => {
  return (
    <>
      <HeaderPW onLogout={onLogout} />
      <MenuBar />
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