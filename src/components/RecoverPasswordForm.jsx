import React, { useState } from 'react';
import '../styles/RegisterForm.css';
import emailIcon from "../assets/email-icon.svg";
import { showAlert } from "./Alert.jsx";
import Header from './Header.jsx';

const DOMAIN_URL = import.meta.env.VITE_BACKEND_URL


const RecoverPasswordForm = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRecoverClick = async () => {
    if (!email) {
      return await showAlert("error", "El correo es obligatorio");
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${DOMAIN_URL}/psR/recover-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email }),
      });

      const data = await response.json();
      if (response.ok) {
        await showAlert("success", "Se ha enviado un correo para restablecer tu contraseña");
        onBackToLogin();
      } else {
        await showAlert("error", data.message || "No se pudo enviar el correo");
      }
    } catch (error) {
      await showAlert("error", "Error de conexión con el servidor");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <Header />
      <div className="inputs-register-all-container">
        <h2 className="register-title">
          <a className="register-back-arrow" onClick={onBackToLogin}>&larr;</a>
          Recuperar contraseña
        </h2>

        <div className="register-form-group">
          <label className="register-label" htmlFor="correo">Correo electrónico</label>
          <div className="register-input-container">
            <img src={emailIcon} alt="Correo" />
            <input
              className="register-input"
              type="email"
              name="correo"
              placeholder="Introduce tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <button 
          className="register-btn" 
          onClick={handleRecoverClick}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar instrucciones'}
        </button>
      </div>
    </div>
  );
};

export default RecoverPasswordForm;