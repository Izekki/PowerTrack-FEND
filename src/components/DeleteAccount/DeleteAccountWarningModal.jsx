import { useState } from 'react';
import ConfirmDeleteAccountModal from './ConfirmDeleteAccountModal';
import styles from './DeleteAccount.module.css';

/**
 * DeleteAccountWarningModal Component
 * 
 * ETAPA 1 del flujo de eliminación de cuenta
 * 
 * Muestra:
 * - Advertencia clara sobre irreversibilidad
 * - Lista de datos que se eliminarán
 * - Botones: CANCELAR | SÍ, CONTINUAR
 * 
 * Si usuario confirma → Abre Modal Etapa 2 (Confirmación)
 * Si usuario cancela → Cierra modal y vuelve a ProfilePage
 * 
 * @param {boolean} isOpen - Controla visibilidad del modal
 * @param {string} userId - ID del usuario a eliminar
 * @param {string} token - JWT token para autorización
 * @param {function} onCancel - Callback cuando usuario cancela
 * @param {function} onSuccess - Callback después de eliminación exitosa
 * @returns {React.ReactElement | null}
 */
export default function DeleteAccountWarningModal({ 
  isOpen, 
  userId, 
  token, 
  onCancel, 
  onSuccess 
}) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Si ninguno de los modales está abierto, no renderizar
  if (!isOpen && !showConfirmModal) {
    return null;
  }

  /**
   * Usuario confirmó en Etapa 1, abre Etapa 2
   */
  const handleYesClick = () => {
    setShowConfirmModal(true);
  };

  /**
   * Usuario canceló, cierra ambos modales
   */
  const handleCancelWarning = () => {
    setShowConfirmModal(false);
    onCancel();
  };

  /**
   * Cierra Modal 2 y vuelve a ProfilePage
   */
  const handleConfirmModalClose = () => {
    setShowConfirmModal(false);
    onCancel();
  };

  /**
   * Manejador de click en overlay (fondo oscuro)
   * Cierra modal si hace click en el overlay (no en el contenido)
   */
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !showConfirmModal) {
      handleCancelWarning();
    }
  };

  /**
   * Manejador de tecla ESC
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && !showConfirmModal) {
      handleCancelWarning();
    }
  };

  // Si Modal 2 está abierto, mostrar ese en su lugar
  if (showConfirmModal) {
    return (
      <ConfirmDeleteAccountModal
        isOpen={true}
        userId={userId}
        token={token}
        onCancel={handleConfirmModalClose}
        onSuccess={onSuccess}
      />
    );
  }

  // Renderizar Modal 1 (Advertencia)
  return (
    <div 
      className={styles.modalOverlay}
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="warning-modal-title"
    >
      <div className={styles.modalContent}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2 id="warning-modal-title">¿Estás Seguro?</h2>
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          {/* Advertencia principal */}
          <p className={styles.warningText}>
            Esta acción es <strong>IRREVERSIBLE</strong>
          </p>

          {/* Descripción */}
          <p className={styles.descriptionText}>
            Se eliminarán permanentemente:
          </p>

          {/* Lista de datos a eliminar */}
          <ul className={styles.deleteList}>
            <li>Tu perfil de usuario</li>
            <li>Todos tus dispositivos</li>
            <li>Todos tus grupos de dispositivos</li>
            <li>Todos tus sensores</li>
            <li>Todas tus alertas configuradas</li>
            <li>Todos tus reportes generados</li>
          </ul>

          {/* Alerta de no recuperación */}
          <p className={styles.dangerText}>
            No podemos recuperar tus datos después de esta acción
          </p>
        </div>

        {/* Footer con Botones */}
        <div className={styles.modalFooter}>
          <button 
            className={styles.cancelBtn}
            onClick={handleCancelWarning}
            aria-label="Cancelar eliminación de cuenta"
            type="button"
          >
            CANCELAR
          </button>
          <button 
            className={styles.confirmBtn}
            onClick={handleYesClick}
            aria-label="Continuar con eliminación de cuenta"
            type="button"
          >
            SÍ, CONTINUAR
          </button>
        </div>
      </div>
    </div>
  );
}
