// Header.jsx
import React from 'react';
import '../../styles/AuthComponentsCss/LoginForm.css'; // Asegúrate que aquí se incluya el estilo del header
import logo from '../../assets/logo-pw.svg';

const Header = ({ showLogo = true }) => {
  return (
    <header className="header">
      {showLogo && (
        <div className="logo">
          <img src={logo} alt="Logo" className="logo-img" />
        </div>
      )}
    </header>
  );
};

export default Header;
