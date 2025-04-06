// Header.jsx
import React from 'react';
import '../styles/LoginForm.css'; // Asegúrate que aquí se incluya el estilo del header
import logo from '../assets/logo-pw.svg';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="Logo" className="logo-img" />
      </div>
    </header>
  );
};

export default Header;
