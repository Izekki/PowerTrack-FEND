// ResetPasswordForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/AuthComponentsCss/RegisterForm.css';
import passwordIcon from "../../assets/password-icon.svg";
import eyeIcon from "../../assets/eye-icon.svg";
import eyeSlashIcon from "../../assets/eye-slash-icon.svg";
import { showAlert } from "../CommonComponents/Alert.jsx";
import Header from './Header.jsx';
import { useAuthApi } from "../../hooks/api/useAuthApi";

const ResetPasswordForm = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { verifyToken, resetPassword, loading } = useAuthApi();

  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const verifyResetToken = async () => {
      try {
        const data = await verifyToken(token);
        if (data?.success) {
          setIsTokenValid(true);
        } else {
          await showAlert("error", "Token inválido o expirado");
          setTimeout(() => navigate('/login'), 2000);
        }
      } catch (error) {
        await showAlert("error", "Error de conexión con el servidor");
        setTimeout(() => navigate('/login'), 2000);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      verifyResetToken();
    }
  }, [token, navigate, verifyToken]);

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
      await resetPassword({
        token,
        nuevaPassword: formData.password,
        confirmarPassword: formData.confirmPassword
      });
      await showAlert("success", "Contraseña actualizada correctamente");
      setTimeout(() => navigate('/login'), 500);
    } catch (error) {
      await showAlert("error", error?.message || "No se pudo restablecer la contraseña");
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

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar nueva contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
