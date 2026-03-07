/**
 * Preferences Service - Gestiona las preferencias de usuario (contraste y tema)
 * 
 * Este servicio maneja la sincronización de preferencias de accesibilidad
 * entre localStorage (cache local) y el backend.
 */

import { apiGet, apiPut } from '../apiHelper';

const ALLOWED_CONTRAST = ['normal', 'high', 'very-high'];
const ALLOWED_THEME = ['light', 'dark'];

const normalizePreferences = (payload = {}) => {
  const contrastLevel = ALLOWED_CONTRAST.includes(payload.contrastLevel)
    ? payload.contrastLevel
    : 'normal';
  const theme = ALLOWED_THEME.includes(payload.theme)
    ? payload.theme
    : 'light';

  return { contrastLevel, theme };
};

/**
 * Obtiene las preferencias del usuario desde el backend
 * @param {string|number} userId - ID del usuario
 * @returns {Promise<{contrastLevel: string, theme: string}>}
 */
export const getUserPreferences = async (userId) => {
  const response = await apiGet(`/preferences/${userId}`);
  return normalizePreferences(response);
};

/**
 * Actualiza las preferencias del usuario en el backend
 * @param {string|number} userId - ID del usuario
 * @param {Object} preferences - Preferencias a actualizar
 * @param {string} [preferences.contrastLevel] - Nivel de contraste: "normal" | "high" | "very-high"
 * @param {string} [preferences.theme] - Tema: "light" | "dark"
 * @returns {Promise<{contrastLevel: string, theme: string}>}
 */
export const updateUserPreferences = async (userId, preferences) => {
  const payload = {};

  if (preferences.contrastLevel) {
    payload.contrastLevel = preferences.contrastLevel;
  }

  if (preferences.theme) {
    payload.theme = preferences.theme;
  }

  const response = await apiPut(`/preferences/${userId}`, payload);
  return normalizePreferences(response);
};
