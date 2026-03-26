/**
 * Servicio para eliminar cuenta de usuario
 * Endpoint: DELETE /user/:id
 * 
 * Responsabilidades:
 * - Llamar API DELETE /user/:id con JWT token
 * - Manejo robusto de códigos HTTP
 * - Limpieza de localStorage y sessionStorage
 */

import { apiFetch } from "./apiHelper";

/**
 * Elimina la cuenta del usuario actual
 * @param {string} userId - ID del usuario a eliminar
 * @param {string} token - JWT token para autorización
 * @returns {Promise<Object>} { success: boolean, status?: number, message: string, error?: any }
 */
export async function deleteAccount(userId, token) {
  if (!userId || !token) {
    return {
      success: false,
      message: "Usuario o token no disponibles"
    };
  }

  try {
    const responseData = await apiFetch(
      `/user/${userId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ confirmacion: "Confirmar" }),
      },
      false
    );

    return {
      success: true,
      status: 200,
      message: responseData?.message || "Cuenta eliminada exitosamente"
    };

  } catch (error) {
    // Mapear codigos HTTP a mensajes claros
    const errorMessages = {
      400: "Confirmación incorrecta",
      403: "No tienes permiso para eliminar esta cuenta",
      404: "Usuario no encontrado",
      500: "Error del servidor. Inténtalo más tarde",
    };

    console.error('Error al eliminar cuenta:', error);
    return {
      success: false,
      status: error?.status,
      message:
        errorMessages[error?.status] ||
        error?.message ||
        "Error de red. Verifica tu conexion",
      error: error?.details || error?.message
    };
  }
}

/**
 * Limpia todos los datos de sesión del usuario
 * - Borra localStorage
 * - Borra sessionStorage
 * 
 * Se ejecuta DESPUÉS de respuesta exitosa (200)
 */
export function clearUserSession() {
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch (error) {
    console.error('Error al limpiar sesión:', error);
  }
}
