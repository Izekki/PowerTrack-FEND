/**
 * API Helper - Facilita las llamadas a la API con autenticación JWT
 * 
 * Este archivo proporciona funciones auxiliares para realizar peticiones HTTP
 * con autenticación JWT automática y manejo de errores centralizado.
 */

const DOMAIN_URL = import.meta.env.VITE_BACKEND_URL;

/**
 * Obtiene el token JWT del sessionStorage
 * @returns {string|null} Token JWT o null si no existe
 */
export const getAuthToken = () => {
  return sessionStorage.getItem('token');
};

/**
 * Crea los headers con autenticación JWT
 * @param {Object} additionalHeaders - Headers adicionales opcionales
 * @returns {Object} Headers con Authorization
 */
export const createAuthHeaders = (additionalHeaders = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...additionalHeaders,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Maneja los errores de respuesta HTTP
 * @param {Response} response - Respuesta de fetch
 * @param {boolean} redirectOnAuth - Si debe redirigir en error de autenticación
 * @throws {Error} Error con mensaje descriptivo
 */
export const handleApiError = async (response, redirectOnAuth = true) => {
  if (response.status === 401) {
    // Token inválido o expirado
    console.error('Token inválido o expirado');
    if (redirectOnAuth) {
      sessionStorage.clear();
      window.location.href = '/login';
    }
    throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
  } else if (response.status === 403) {
    // Sin permisos
    console.error('Acceso denegado: No tienes permisos para acceder a este recurso');
    throw new Error('No tienes permisos para acceder a este recurso.');
  } else if (!response.ok) {
    // Otros errores
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || `Error ${response.status}: ${response.statusText}`;
    throw new Error(errorMessage);
  }
};

/**
 * Realiza una petición fetch con autenticación JWT
 * @param {string} endpoint - Endpoint de la API (sin DOMAIN_URL)
 * @param {Object} options - Opciones de fetch
 * @param {boolean} redirectOnAuth - Si debe redirigir en error de autenticación
 * @returns {Promise<any>} Datos de la respuesta
 */
export const apiFetch = async (endpoint, options = {}, redirectOnAuth = true) => {
  const url = `${DOMAIN_URL}${endpoint}`;
  
  // Combinar headers por defecto con los proporcionados
  const headers = createAuthHeaders(options.headers);
  
  const fetchOptions = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, fetchOptions);
    await handleApiError(response, redirectOnAuth);
    
    // Si la respuesta es exitosa, intentar parsear JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return response;
  } catch (error) {
    console.error(`Error en ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Realiza una petición GET con autenticación
 * @param {string} endpoint - Endpoint de la API
 * @param {boolean} redirectOnAuth - Si debe redirigir en error de autenticación
 * @returns {Promise<any>} Datos de la respuesta
 */
export const apiGet = (endpoint, redirectOnAuth = true) => {
  return apiFetch(endpoint, { method: 'GET' }, redirectOnAuth);
};

/**
 * Realiza una petición POST con autenticación
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} data - Datos a enviar
 * @param {boolean} redirectOnAuth - Si debe redirigir en error de autenticación
 * @returns {Promise<any>} Datos de la respuesta
 */
export const apiPost = (endpoint, data = {}, redirectOnAuth = true) => {
  return apiFetch(
    endpoint,
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    redirectOnAuth
  );
};

/**
 * Realiza una petición PUT con autenticación
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} data - Datos a enviar
 * @param {boolean} redirectOnAuth - Si debe redirigir en error de autenticación
 * @returns {Promise<any>} Datos de la respuesta
 */
export const apiPut = (endpoint, data = {}, redirectOnAuth = true) => {
  return apiFetch(
    endpoint,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    },
    redirectOnAuth
  );
};

/**
 * Realiza una petición DELETE con autenticación
 * @param {string} endpoint - Endpoint de la API
 * @param {boolean} redirectOnAuth - Si debe redirigir en error de autenticación
 * @returns {Promise<any>} Datos de la respuesta
 */
export const apiDelete = (endpoint, redirectOnAuth = true) => {
  return apiFetch(endpoint, { method: 'DELETE' }, redirectOnAuth);
};

/**
 * Obtiene el dominio de la API
 * @returns {string} URL del dominio
 */
export const getApiDomain = () => DOMAIN_URL;
