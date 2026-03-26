import { apiPost, getApiDomain } from "../apiHelper";

const CONTACT_ENDPOINT = "/contacto";

export const sendContactMessage = async (payload) => {
  const baseUrl = getApiDomain();

  if (!baseUrl) {
    throw {
      status: 0,
      message: "No se ha configurado la URL del backend.",
      data: null,
    };
  }

  try {
    return await apiPost(CONTACT_ENDPOINT, payload, false);
  } catch (error) {
    throw {
      status: error?.status ?? 0,
      message:
        error?.message ||
        "Error de conexion. Verifica tu red e intenta nuevamente.",
      data: error?.details || null,
    };
  }
};
