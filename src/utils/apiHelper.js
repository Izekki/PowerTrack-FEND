/**
 * Fachada de compatibilidad para no romper imports actuales.
 * La implementacion real vive en src/utils/api/client.js.
 */

export {
  apiDelete,
  apiFetch,
  apiGet,
  apiPatch,
  apiPost,
  apiPut,
  createAuthHeaders,
  getApiDomain,
  getAuthToken,
  handleApiError,
} from "./api/client";
