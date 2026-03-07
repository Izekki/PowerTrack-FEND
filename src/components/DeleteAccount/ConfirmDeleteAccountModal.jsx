import { useState } from 'react';
import { deleteAccount, clearUserSession } from '../../utils/deleteAccountService';
import styles from './DeleteAccount.module.css';

/**
 * ConfirmDeleteAccountModal Component
 * 
 * ETAPA 2 del flujo de eliminación de cuenta
 * 
 * Muestra:
 * - Input de texto para escribir "Confirmar"
 * - Botón deshabilitado hasta que input coincida exactamente
 * - Validación en tiempo real
 * - Manejo de errores de API
 * 
 * Flujo:
 * 1. Input vacío o incorrecto → Botón deshabilitado (gris)
 * 2. Input = "Confirmar" → Botón habilitado (rojo)
 * 3. Click en botón → Llamada API DELETE /user/:id
 * 4. Respuesta 200 → Mensaje success → 2s → logout → redirect
 * 5. Error → Mostrar mensaje específico → Opción reintentar
 * 
 * @param {boolean} isOpen - Controla visibilidad del modal
 * @param {string} userId - ID del usuario a eliminar
 * @param {string} token - JWT token para autorización
 * @param {function} onCancel - Callback cuando usuario cancela
 * @param {function} onSuccess - Callback después de eliminación exitosa
 * @returns {React.ReactElement | null}
 */
export default function ConfirmDeleteAccountModal({ 
  isOpen, 
  userId, 
  token, 
  onCancel, 
  onSuccess 
}) {
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(false);

  // Botón habilitado solo si input coincide exactamente con "Confirmar"
  const isButtonEnabled = inputValue === 'Confirmar' && !loading;

  /**
   * Manejador de cambio en input
   * Actualiza estado y limpia errores previos
   */
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setError(null);
  };

  /**
   * Manejador de teclas
   * - ESC cierra modal
   * - Enter NO envía (solo el botón con click)
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && !loading) {
      onCancel();
    }
    // Prevenir envío con Enter
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  /**
   * Confirma la eliminación
   * - Llamada a DELETE /user/:id
   * - Manejo de respuestas (200, 400, 403, 404, 500)
   * - Si éxito: mostrar mensaje → 2s → logout → redirect
   * - Si error: mostrar mensaje de error
   */
  const handleConfirmDelete = async () => {
    if (!isButtonEnabled) return;

    setLoading(true);
    setError(null);

    // Llamada a servicio API
    const result = await deleteAccount(userId, token);

    if (result.success) {
      // Éxito: Show success message
      setSuccessMessage(true);
      
      // Esperar 2 segundos antes de limpiar y logout
      setTimeout(() => {
        // Limpiar localStorage y sessionStorage
        clearUserSession();
        
        // Ejecutar callback de éxito (logout y navigate)
        onSuccess?.();
      }, 2000);
    } else {
      // Error: Show error message y permitir reintentar
      setLoading(false);
      setError(result.message);
    }
  };

  /**
   * Limpia el input si usuario quiere reintentar
   */
  const handleRetry = () => {
    setInputValue('');
    setError(null);
  };

  if (!isOpen) return null;

  // Renderizar según estado (éxito o en proceso)
  if (successMessage) {
    return (
      <div 
        className={styles.modalOverlay}
        role="dialog"
        aria-modal="true"
        aria-labelledby="success-modal-title"
      >
        <div className={styles.modalContent}>
          {/* Header de Éxito */}
          <div className={styles.modalHeader}>
            <h2 id="success-modal-title">Cuenta Eliminada</h2>
          </div>

          {/* Body de Éxito */}
          <div className={styles.modalBody}>
            <p className={styles.successText}>
              Tu cuenta ha sido eliminada exitosamente.
            </p>
            <p className={styles.redirectText}>
              Redirigiendo a login...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar Modal de Confirmación
  return (
    <div 
      className={styles.modalOverlay}
      onClick={({ target }) => target === event.currentTarget && !loading && onCancel()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div className={styles.modalContent}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2 id="confirm-modal-title">Confirmar Eliminación</h2>
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          {/* Instrucción de input */}
          <label htmlFor="confirmInput" className={styles.inputLabel}>
            Escribe <strong>"Confirmar"</strong> para proceder:
          </label>

          {/* Input */}
          <input
            id="confirmInput"
            type="text"
            className={styles.confirmInput}
            placeholder="Confirmar"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={loading}
            autoFocus
            aria-label="Escribe Confirmar para proceder con eliminación de cuenta"
          />
          
          {/* Hint */}
          <p className={styles.inputHint}>
            El texto es sensible a mayúsculas
          </p>

          {/* Error Message */}
          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}
        </div>

        {/* Footer con Botones */}
        <div className={styles.modalFooter}>
          <button 
            className={styles.cancelBtn}
            onClick={error ? handleRetry : onCancel}
            disabled={loading}
            type="button"
            aria-label={error ? "Reintentar eliminación" : "Cancelar eliminación de cuenta"}
          >
            {error ? 'REINTENTAR' : 'CANCELAR'}
          </button>

          <button 
            className={`${styles.deleteConfirmBtn} ${
              isButtonEnabled ? styles.enabled : styles.disabled
            }`}
            onClick={handleConfirmDelete}
            disabled={!isButtonEnabled}
            type="button"
            aria-label="Eliminar cuenta permanentemente"
            aria-disabled={!isButtonEnabled}
          >
            {loading ? 'Eliminando...' : 'ELIMINAR PERMANENTE'}
          </button>
        </div>
      </div>
    </div>
  );
}
