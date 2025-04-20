// ResetPasswordForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/RegisterForm.css';
import passwordIcon from "../assets/password-icon.svg";
import eyeIcon from "../assets/eye-icon.svg";
import eyeSlashIcon from "../assets/eye-slash-icon.svg";
import { showAlert } from "./Alert.jsx";
import Header from './Header.jsx';
const DOMAIN_URL = import.meta.env.VITE_BACKEND_URL

const ResetPasswordForm = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch(`${DOMAIN_URL}/psR/verify-token/${token}`);
        const data = await response.json();

        if (data.success) {
          setIsTokenValid(true);
        } else {
          await showAlert("error", data.message || "Token inválido o expirado");
          setTimeout(() => navigate('/login', 2000));
        }
      } catch (error) {
        await showAlert("error", "Error de conexión con el servidor");
        setTimeout(() => navigate('/login'), 2000);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.password || !formData.confirmPassword) {
      return await showAlert("error", "Todos los campos son obligatorios");
    }

    if (formData.password !== formData.confirmPassword) {
      return await showAlert("error", "Las contraseñas no coinciden");
    }

    try {
      const response = await fetch(`${DOMAIN_URL}/psR/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          nuevaPassword: formData.password,
          confirmarPassword: formData.confirmPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await showAlert("success", "Contraseña actualizada correctamente");
        setTimeout(() => navigate('/login', 500));
      } else {
        await showAlert("error", data.message || "No se pudo restablecer la contraseña");
      }
    } catch (error) {
      await showAlert("error", "Error de conexión con el servidor");
    }
  };

  if (isLoading) {
    return (
      <div className="register-container">
        <Header />
        <div className="inputs-register-all-container">
          <h2 className="register-title">Verificando token...</h2>
          <p>Por favor espere mientras verificamos su solicitud</p>
        </div>
      </div>
    );
  }

  if (!isTokenValid) {
    return (
      <div className="register-container">
        <Header />
        <div className="inputs-register-all-container">
          <h2 className="register-title">Token inválido</h2>
          <p>El enlace de recuperación no es válido o ha expirado</p>
          <button
            className="register-btn"
            onClick={() => navigate('/login')}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="register-container">
      <Header />
      <div className="inputs-register-all-container">
        <h2 className="register-title">Restablecer contraseña</h2>
        <form onSubmit={handleSubmit}>
          <div className="register-form-group">
            <label className="register-label" htmlFor="password">Nueva contraseña</label>
            <div className="register-input-container">
              <img src={passwordIcon} alt="Contraseña" />
              <input
                className="register-input"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Ingresa tu nueva contraseña"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <img
                src={showPassword ? eyeSlashIcon : eyeIcon}
                alt="Toggle password visibility"
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
          </div>

          <div className="register-form-group">
            <label className="register-label" htmlFor="confirmPassword">Confirmar contraseña</label>
            <div className="register-input-container">
              <img src={passwordIcon} alt="Confirmar Contraseña" />
              <input
                className="register-input"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirma tu nueva contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <img
                src={showConfirmPassword ? eyeSlashIcon : eyeIcon}
                alt="Toggle confirm password visibility"
                className="eye-icon"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </div>
          </div>

          <button type="submit" className="register-btn">Guardar nueva contraseña</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
