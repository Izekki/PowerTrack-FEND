import { useState } from 'react';
import DeleteAccountWarningModal from './DeleteAccountWarningModal';
import styles from './DeleteAccount.module.css';

/**
 * DeleteAccountButton Component
 * 
 * Componente que renderiza:
 * - Card transparente con borde rojo
 * - Botón rojo destructivo
 * - Gestiona apertura del modal de advertencia
 * 
 * @param {string} userId - ID del usuario actual
 * @param {string} token - JWT token para autorización
 * @param {function} onSuccess - Callback ejecutado después de eliminación exitosa
 * @returns {React.ReactElement}
 */
export default function DeleteAccountButton({ userId, token, onSuccess }) {
  const [showWarningModal, setShowWarningModal] = useState(false);

  /**
   * Abre el modal de advertencia
   */
  const handleOpenWarning = () => {
    setShowWarningModal(true);
  };

  /**
   * Cierra el modal de advertencia
   */
  const handleCloseWarning = () => {
    setShowWarningModal(false);
  };

  return (
    <>
      {/* Card de Eliminación de Cuenta - Transparente con Borde Rojo */}
      <section className={styles.deleteAccountSection}>
        <div className={styles.deleteAccountCard}>
          {/* Título */}
          <h3 className={styles.cardTitle}>Eliminar cuenta</h3>

          {/* Footer: Descripción + Botón */}
          <div className={styles.cardFooter}>
            <p className={styles.cardDescription}>
              Eliminar cuenta es una acción no reversible
            </p>
            <button 
              className={styles.deleteBtn}
              onClick={handleOpenWarning}
              aria-label="Eliminar cuenta permanentemente"
              type="button"
            >
              Eliminar Cuenta
            </button>
          </div>
        </div>
      </section>

      {/* Modal de Advertencia - Etapa 1 */}
      <DeleteAccountWarningModal
        isOpen={showWarningModal}
        userId={userId}
        token={token}
        onCancel={handleCloseWarning}
        onSuccess={onSuccess}
      />
    </>
  );
}
