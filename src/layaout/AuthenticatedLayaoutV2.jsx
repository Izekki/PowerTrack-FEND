import React from "react";
import MenuBarWithBurger from "../components/MenuBarWithBurger";

const AuthenticatedLayout = ({ children, isModalOpen, onConfirm, onCancel }) => {
  return (
    <>
      <MenuBarWithBurger/>
      {children}
      {
      /*
      {isModalOpen && (
        <LogoutConfirmModal 
          onConfirm={onConfirm} 
          onCancel={onCancel} 
        />
      )} */
      }
      
    </>
  );
};

export default AuthenticatedLayout;