import { apiGet, apiPost } from "../apiHelper";

export const loginUser = (credentials) => {
  return apiPost("/login", credentials, false);
};

export const registerUser = (payload) => {
  return apiPost("/user/register", payload, false);
};

export const getSuppliers = () => {
  return apiGet("/supplier", false);
};

export const recoverPassword = (correo) => {
  return apiPost("/psR/recover-password", { correo }, false);
};

export const verifyResetToken = (token) => {
  return apiGet(`/psR/verify-token/${token}`, false);
};

export const resetPassword = (payload) => {
  return apiPost("/psR/reset-password", payload, false);
};
