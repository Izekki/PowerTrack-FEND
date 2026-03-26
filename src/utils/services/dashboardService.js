import { apiGet, apiPost } from "../apiHelper";

export const getDashboardConsumption = (userId, queryParams = "") => {
  return apiGet(`/electrical_analysis/consumoPorDispositivosGruposReal/${userId}${queryParams}`);
};

export const getDashboardHistory = (userId, queryParams = "") => {
  return apiGet(`/electrical_analysis/historial_detallado/${userId}${queryParams}`);
};

export const getDashboardAlerts = (userId, queryParams = "?limit=100&filtro=todos") => {
  return apiGet(`/alertas/usuario/${userId}${queryParams}`);
};

export const getDashboardConfig = (userId) => {
  return apiGet(`/user/dashboard-config/${userId}`);
};

export const saveDashboardConfig = (userId, layout) => {
  return apiPost(`/user/dashboard-config/${userId}`, { layout });
};
