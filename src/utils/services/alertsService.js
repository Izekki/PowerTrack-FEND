import { apiGet, apiPost, apiPut } from "../apiHelper";

export const getUserAlerts = ({ userId, limit = 10, offset = 0, filtro = "todos" }) => {
  return apiGet(`/alertas/usuario/${userId}?limit=${limit}&offset=${offset}&filtro=${filtro}`);
};

export const markAlertAsRead = (alertId) => {
  return apiPut(`/alertas/marcar-una/${alertId}`);
};

export const markAllAlertsAsRead = (userId) => {
  return apiPut(`/alertas/marcar-leidas/${userId}`);
};

export const getNewAlertsFlag = (userId) => {
  return apiGet(`/alertas/verificar-nuevas/${userId}`);
};

export const getAlertThresholds = (userId) => {
  return apiGet(`/savsetting/configuraciones/usuario/${userId}`);
};

export const updateAlertThresholds = ({ dispositivo_id, minimo, maximo }) => {
  return apiPost("/savsetting/update-minmax", { dispositivo_id, minimo, maximo });
};
