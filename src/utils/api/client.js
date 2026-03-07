/**
 * API Client centralizado para transporte HTTP, autenticacion y manejo de errores.
 */

import { ApiError, buildApiError } from "./errors";

const DOMAIN_URL = import.meta.env.VITE_BACKEND_URL;

export const getApiDomain = () => DOMAIN_URL;

export const getAuthToken = () => {
  return sessionStorage.getItem("token");
};

export const createAuthHeaders = (additionalHeaders = {}) => {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...additionalHeaders,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const isAbsoluteUrl = (value) => /^https?:\/\//i.test(value);

const resolveUrl = (endpoint) => {
  if (isAbsoluteUrl(endpoint)) return endpoint;
  return `${DOMAIN_URL}${endpoint}`;
};

const parseSuccessResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json().catch(() => ({}));
  }

  if (response.status === 204) {
    return null;
  }

  return response;
};

export const handleApiError = async (
  response,
  redirectOnAuth = true,
  endpoint = null
) => {
  if (response.status === 401) {
    if (redirectOnAuth) {
      sessionStorage.clear();
      window.location.href = "/login";
    }

    throw new ApiError("Sesion expirada. Por favor, inicia sesion nuevamente.", {
      status: 401,
      code: "UNAUTHORIZED",
      endpoint,
    });
  }

  if (response.status === 403) {
    throw new ApiError("No tienes permisos para acceder a este recurso.", {
      status: 403,
      code: "FORBIDDEN",
      endpoint,
    });
  }

  if (!response.ok) {
    throw await buildApiError(response, {
      endpoint,
      fallbackMessage: null,
      defaultCode: "HTTP_ERROR",
    });
  }
};

export const apiFetch = async (endpoint, options = {}, redirectOnAuth = true) => {
  const url = resolveUrl(endpoint);
  const headers = createAuthHeaders(options.headers);
  const fetchOptions = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, fetchOptions);
    await handleApiError(response, redirectOnAuth, endpoint);
    return await parseSuccessResponse(response);
  } catch (error) {
    console.error(`Error en ${endpoint}:`, error);
    throw error;
  }
};

export const apiGet = (endpoint, redirectOnAuth = true) => {
  return apiFetch(endpoint, { method: "GET" }, redirectOnAuth);
};

export const apiPost = (endpoint, data = {}, redirectOnAuth = true) => {
  return apiFetch(
    endpoint,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    redirectOnAuth
  );
};

export const apiPut = (endpoint, data = {}, redirectOnAuth = true) => {
  return apiFetch(
    endpoint,
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
    redirectOnAuth
  );
};

export const apiPatch = (endpoint, data = {}, redirectOnAuth = true) => {
  return apiFetch(
    endpoint,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    },
    redirectOnAuth
  );
};

export const apiDelete = (endpoint, redirectOnAuth = true) => {
  return apiFetch(endpoint, { method: "DELETE" }, redirectOnAuth);
};
