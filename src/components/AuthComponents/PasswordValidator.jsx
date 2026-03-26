import React from 'react';
import { passwordRules } from '../../utils/passwordValidations';
import '../../styles/AuthComponentsCss/PasswordValidator.css';

const PasswordValidator = ({ password, isVisible }) => {
  if (!isVisible || password === '') {
    return null;
  }

  const validationStatus = passwordRules.reduce((acc, rule) => {
    acc[rule.id] = rule.validate(password);
    return acc;
  }, {});

  return (
    <div className="password-validator-panel">
      <h4 className="validator-title">Requisitos de contraseña</h4>
      <div className="validator-rules">
        {passwordRules.map((rule) => (
          <div
            key={rule.id}
            className={`validator-rule ${validationStatus[rule.id] ? 'valid' : 'invalid'}`}
          >
            <span className="validator-check-icon">
              {validationStatus[rule.id] ? '✓' : '○'}
            </span>
            <span className="validator-label">{rule.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordValidator;
