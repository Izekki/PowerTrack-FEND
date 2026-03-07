/**
 * Errores de capa API con estructura consistente para toda la app.
 */

export class ApiError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = "ApiError";
    this.status = options.status ?? null;
    this.code = options.code ?? null;
    this.details = options.details ?? null;
    this.endpoint = options.endpoint ?? null;
    this.response = options.response ?? null;
  }
}

export const extractErrorPayload = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json().catch(() => ({}));
  }

  const text = await response.text().catch(() => "");
  if (!text) return {};

  return { message: text };
};

export const buildApiError = async (
  response,
  {
    endpoint = null,
    fallbackMessage = null,
    defaultCode = null,
    includeResponse = false,
  } = {}
) => {
  const payload = await extractErrorPayload(response);
  const message =
    payload?.message ||
    fallbackMessage ||
    `Error ${response.status}: ${response.statusText}`;

  return new ApiError(message, {
    status: response.status,
    code: payload?.code || defaultCode,
    details: payload,
    endpoint,
    response: includeResponse ? response : null,
  });
};
