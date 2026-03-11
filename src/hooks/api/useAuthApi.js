/**
 * Hook para consumir authService.js
 * Maneja loading, error y persistencia de sesion (sessionStorage)
 */

import { useState } from "react";
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

  const clearError = () => setError(null);

  const login = async (credentials) => {
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
  };

  const register = async (payload) => {
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
  };

  const loadSuppliers = async () => {
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
  };

  const recoverPassword = async (email) => {
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
  };

  const verifyToken = async (token) => {
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
  };

  const resetPassword = async (payload) => {
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
  };

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
