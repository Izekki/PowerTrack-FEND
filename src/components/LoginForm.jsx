import React, { useState } from 'react';
import '../styles/LoginForm.css';
import logo from "../assets/logo-pw.svg";
import emailIcon from "../assets/email-icon.svg";
import passwordIcon from "../assets/password-icon.svg";
import eyeIcon from "../assets/eye-icon.svg";
import eyeSlashIcon from "../assets/eye-slash-icon.svg";
import RegisterForm from './RegisterForm.jsx';
import Header from './Header.jsx';
import { showAlert } from "./Alert.jsx";

const LoginForm = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [register, setRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLoginClick = async () => {
    if (!formData.email || !formData.password) {
      showAlert("error", "Todos los campos son obligatorios");
      return;
    }

    try {
      const response = await fetch('http://localhost:5051/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        await showAlert("success", "Inicio de sesión exitoso");
        sessionStorage.setItem("userId", data.userId);
        sessionStorage.setItem("token", data.token);
        onLoginSuccess();
      } else {
        await showAlert("error", data.message || "Error al iniciar sesión");
      }
    } catch {
      await showAlert("error", "Error de conexión con el servidor");
    }
  };

  const handleGoToRegisterClick = () => setRegister(true);
  const handleSuccesRegister = () => setRegister(false);

  if (register) {
    return <RegisterForm onRegisterSuccess={handleSuccesRegister} />;
  }

  return (
    <div className="login-container">
      <Header />
      <div className="login-form-inputs-container">
        <h2 className="h2-iniciar-sesion">Iniciar Sesión</h2>

        <div className="form-group">
          <label className="label-Form-Login" htmlFor="email">Correo electrónico</label>
          <div className="input-container">
            <img src={emailIcon} alt="Email" />
            <input
              className='form-control-inputs'
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
            <input
              className='form-control-inputs'
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Introduzca su contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <img
              src={showPassword ? eyeSlashIcon : eyeIcon}
              alt="Toggle password visibility"
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: "pointer", marginLeft: "8px" }}
            />
          </div>
        </div>
      </div>

      <a href="#" className="forgot-password">Recuperar contraseña</a>
      <button className="login-btn" onClick={handleLoginClick}>INICIAR SESIÓN</button>
      <p className="register-link">¿No tienes una cuenta?</p>
      <a href="#" className="forgot-password" onClick={handleGoToRegisterClick}>Crear una cuenta</a>
    </div>
  );
};

export default LoginForm;
