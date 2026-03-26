/**
 * Hook para cargar preferencias de usuario al iniciar sesión
 * Sincroniza las preferencias del backend con el estado local
 */

import { useEffect } from 'react';
import { useContrast } from '../context/ContrastContext';
import { useAuth } from '../context/AuthContext';

export const useLoadUserPreferences = () => {
  const { loadUserPreferences, loadedUserId } = useContrast();
  const { userId, isAuthenticated } = useAuth();

  useEffect(() => {
    // Cargar preferencias cuando inicia sesión o cuando cambia el usuario
    if (isAuthenticated && userId && loadedUserId !== String(userId)) {
      loadUserPreferences(userId);
    }
  }, [isAuthenticated, userId, loadedUserId, loadUserPreferences]);

  return { isLoaded: loadedUserId === String(userId) };
};
