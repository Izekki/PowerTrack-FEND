import React, { useState } from 'react';
import '../styles/LoginForm.css';
import logo from "../assets/logo-pw.svg";
import emailIcon from "../assets/email-icon.svg"; // Ícono de correo
import passwordIcon from "../assets/password-icon.svg"; // Ícono de contraseña
import RegisterForm from './RegisterForm.jsx';

const LoginForm = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [register, setRegister] = useState(false);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLoginClick = async () => {
    if (!formData.email || !formData.password) {
      setError('Todos los campos son obligatorios');
      return;
    }

    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5051/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Inicio de sesión exitoso');
        sessionStorage.setItem("userId", data.userId);
        onLoginSuccess();
      } else {
        setError(data.message || 'Error al iniciar sesión');
      }
    } catch {
      setError('Error de conexión con el servidor');
    }
  };

  // ------- champi -------
  const handleGoToRegisterClick = async () => {
    setRegister(true);
  }

  const handleSuccesRegister = async () => {
    setRegister(false);
  }
  // ------- champi -------

    if (register) {
      return <>
        <RegisterForm onRegisterSuccess={handleSuccesRegister} ></RegisterForm>
        </>;
    }

  return (
    <div className="login-container">
        <header className="header"></header>
        <div className="logo">
          <img src={logo} alt="Logo" className="logo-img" />
        </div>
        <h2 className="h2-iniciar-sesion">Iniciar Sesión</h2>
        {error && <p className="error">{error}</p>}

        <div className="form-group">
          <label className="label-Form-Login" htmlFor="email">Correo electrónico</label>
          <div className="input-container">
            <img src={emailIcon} alt="Email" />
            <input className='form-control-inputs'
              type="email" 
              name="email" 
              placeholder="Introduzca su correo electrónico" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>
        </div>

        <div className="form-group">
          <label className="label-Form-Login" htmlFor="password">Contraseña</label>
          <div className="input-container">
            <img src={passwordIcon} alt="Password" />
            <input className='form-control-inputs'
              type="password" 
              name="password" 
              placeholder="Introduzca su contraseña" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
          </div>
        </div>

        <a href="#" className="forgot-password">Recuperar contraseña</a>
        <button className="login-btn" onClick={handleLoginClick}>INICIAR SESIÓN</button>
        <p className="register-link">No tienes una cuenta?</p>
        <a href="#" className="forgot-password" onClick={handleGoToRegisterClick}>Crear una cuenta</a>
    </div>
  );
};

export default LoginForm;
