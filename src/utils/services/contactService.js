import { getApiDomain } from "../apiHelper";

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

  let response;

  try {
    response = await fetch(`${baseUrl}${CONTACT_ENDPOINT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw {
      status: 0,
      message: "Error de conexion. Verifica tu red e intenta nuevamente.",
      data: null,
    };
  }

  const responseData = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw {
      status: response.status,
      message: responseData?.message || "No fue posible enviar el mensaje",
      data: responseData,
    };
  }

  return responseData;
};
