import React, { useState } from 'react';
import '../../styles/AuthComponentsCss/RegisterForm.css';
import emailIcon from "../../assets/email-icon.svg";
import { showAlert } from "../CommonComponents/Alert.jsx";
import Header from './Header.jsx';
import { useAuthApi } from "../../hooks/api/useAuthApi";

const GENERIC_RECOVERY_MESSAGE = 'Si el correo electrónico existe, recibirás instrucciones para restablecer tu contraseña.';

const RecoverPasswordForm = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const { recoverPassword, loading } = useAuthApi();

  const handleRecoverClick = async () => {
    if (!email) {
      return await showAlert("error", "El correo es obligatorio");
    }

    try {
      await recoverPassword(email);
      await showAlert("success", GENERIC_RECOVERY_MESSAGE);
      onBackToLogin();
    } catch (error) {
      await showAlert("success", GENERIC_RECOVERY_MESSAGE);
      onBackToLogin();
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
          <p className="register-label" style={{ marginTop: '8px' }}>
            {GENERIC_RECOVERY_MESSAGE}
          </p>
        </div>

        <button
          className="register-btn"
          onClick={handleRecoverClick}
          disabled={loading}
        >
          {loading ? 'Enviando...' : 'Enviar instrucciones'}
        </button>
      </div>
    </div>
  );
};

export default RecoverPasswordForm;