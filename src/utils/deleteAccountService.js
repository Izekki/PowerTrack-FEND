/**
 * Servicio para eliminar cuenta de usuario
 * Endpoint: DELETE /user/:id
 * 
 * Responsabilidades:
 * - Llamar API DELETE /user/:id con JWT token
 * - Manejo robusto de códigos HTTP
 * - Limpieza de localStorage y sessionStorage
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

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
    const response = await fetch(`${BACKEND_URL}/user/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ confirmacion: 'Confirmar' })
    });

    // Si respuesta no es OK, procesar error
    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch {
        errorData = {};
      }

      // Mapear códigos HTTP a mensajes claros
      const errorMessages = {
        400: "Confirmación incorrecta",
        403: "No tienes permiso para eliminar esta cuenta",
        404: "Usuario no encontrado",
        500: "Error del servidor. Inténtalo más tarde"
      };

      return {
        success: false,
        status: response.status,
        message: errorMessages[response.status] || errorData.message || "Error desconocido",
        error: errorData
      };
    }

    // Respuesta exitosa (200, 204, etc.)
    // Intentar parsear JSON si hay contenido, si no, retornar éxito
    let responseData = {};
    if (response.status !== 204) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          const text = await response.text();
          if (text) {
            responseData = JSON.parse(text);
          }
        } catch {
          // Respuesta vacía o no-JSON, continuar con éxito
          responseData = {};
        }
      }
    }

    return {
      success: true,
      status: response.status,
      message: responseData.message || "Cuenta eliminada exitosamente"
    };

  } catch (error) {
    console.error('Error al eliminar cuenta:', error);
    return {
      success: false,
      message: "Error de red. Verifica tu conexión",
      error: error.message
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
