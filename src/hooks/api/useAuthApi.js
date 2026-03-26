/**
 * Hook para consumir authService.js
 * Maneja loading, error y persistencia de sesion (sessionStorage)
 */

import { useCallback, useState } from "react";
import {
  loginUser,
  registerUser,
  getSuppliers,
  recoverPassword as recoverPasswordService,
  verifyResetToken as verifyResetTokenService,
  resetPassword as resetPasswordService,
} from "../../utils/services/authService";

export const useAuthApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearError = useCallback(() => setError(null), []);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    clearError();
    try {
      const response = await loginUser(credentials);
      // Guardar token e info en sessionStorage
      sessionStorage.setItem("token", response.token);
      sessionStorage.setItem("userId", response.userId);
      sessionStorage.setItem("name", response.nombre || response.name || "");
      return response;
    } catch (err) {
      const message = err?.message || "Error al iniciar sesión";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const register = useCallback(async (payload) => {
    setLoading(true);
    clearError();
    try {
      const response = await registerUser(payload);
      return response;
    } catch (err) {
      const message = err?.message || "Error al registrarse";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const loadSuppliers = useCallback(async () => {
    setLoading(true);
    clearError();
    try {
      const response = await getSuppliers();
      return response;
    } catch (err) {
      const message = err?.message || "Error al obtener proveedores";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const recoverPassword = useCallback(async (email) => {
    setLoading(true);
    clearError();
    try {
      const response = await recoverPasswordService(email);
      return response;
    } catch (err) {
      const message = err?.message || "Error al solicitar recuperación";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const verifyToken = useCallback(async (token) => {
    setLoading(true);
    clearError();
    try {
      const response = await verifyResetTokenService(token);
      return response;
    } catch (err) {
      const message = err?.message || "Token inválido";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const resetPassword = useCallback(async (payload) => {
    setLoading(true);
    clearError();
    try {
      const response = await resetPasswordService(payload);
      return response;
    } catch (err) {
      const message = err?.message || "Error al restablecer contraseña";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  return {
    loading,
    error,
    clearError,
    login,
    register,
    getSuppliers: loadSuppliers,
    recoverPassword,
    verifyToken,
    resetPassword,
  };
};
