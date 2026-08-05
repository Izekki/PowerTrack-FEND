# Propuesta de Reorganizacion de Fetch y Servicios (PowerTrack-FEND)

Fecha: 2026-03-06

## 1) Resumen Ejecutivo

Si, **es necesario reorganizar** la capa de llamadas HTTP.

Hoy la app funciona, pero hay mezcla de patrones:
- `fetch` directo en varias paginas/componentes.
- `apiHelper` en otras partes.
- solo 2 servicios en `src/utils/services/` (`preferencesService`, `helpService`).
- logica de transformacion de datos repetida en UI (pages/widgets).

Esto incrementa costo de mantenimiento, riesgo de regresiones y dificulta pruebas.

## 2) Hallazgos del Analisis

### 2.1 Conteo actual de llamadas
- `fetch(` directos: 19 ocurrencias.
- `apiGet/apiPost/apiPut/apiDelete`: 30 ocurrencias.

### 2.2 Archivos con `fetch` directo
- `src/pages/HomePage.jsx`
- `src/pages/AlertasConfigPage.jsx`
- `src/components/AuthComponents/LoginForm.jsx`
- `src/components/AuthComponents/RegisterForm.jsx`
- `src/components/AuthComponents/RecoverPasswordForm.jsx`
- `src/components/AuthComponents/ResetPasswordForm.jsx`
- `src/utils/deleteAccountService.js`

### 2.3 Riesgos detectados
- Manejo de errores inconsistente (`try/catch` distinto en cada archivo).
- Doble fuente de verdad de endpoints (mismo endpoint en varias vistas).
- Duplicacion de requests del mismo recurso:
  - consumo: `HomePage`, `ConsumoPage`, `TopDevicesList`.
  - perfil/resumen usuario: `ProfilePage`, `SummaryWidget`.
  - alertas: `AlertContext`, `AlertasPage`, `HomePage`.
- Polling distribuido en varias capas sin estrategia comun.
- Logica de mapeo del payload dentro de componentes UI.

## 3) Objetivo de Arquitectura

Estandar recomendado:

1. `apiClient` (transporte, headers, auth, errores)
2. `services` por dominio (endpoints + normalizacion)
3. `hooks` por caso de uso (estado, loading, retry, polling, cache)
4. `pages` coordinan flujo
5. `components` preferentemente presentacionales

## 4) Estructura Objetivo de Carpetas

```text
src/
  utils/
    api/
      client.js            # reemplazo/evolucion de apiHelper.js
      errors.js            # normalizacion de errores
    services/
      authService.js
      alertsService.js
      consumptionService.js
      dashboardService.js
      devicesService.js
      groupsService.js
      profileService.js
      reportsService.js
      settingsService.js   # umbrales y preferencias
      helpService.js
      preferencesService.js
  hooks/
    api/
      useAuthApi.js
      useAlerts.js
      useConsumptionSummary.js
      useDeviceDetails.js
      useDashboardData.js
      useDevices.js
      useGroups.js
      useProfile.js
      useReports.js
      useSettings.js
      useUserPreferences.js
```

## 5) Reglas de Implementacion (importantes)

### 5.1 Reglas para `apiClient`
- Unificar TODO acceso HTTP en un solo cliente (`apiFetch` base).
- Soportar `GET/POST/PUT/PATCH/DELETE`.
- Manejar `401/403/5xx` en un solo lugar.
- Parseo seguro de JSON (aunque venga vacio o no JSON).
- Error tipado estandar:
  - `message`
  - `status`
  - `code` (opcional)
  - `details` (opcional)

### 5.2 Reglas para `services`
- No guardar estado React en service.
- Solo:
  - construir endpoint
  - enviar request
  - adaptar respuesta (DTO -> modelo UI)
- Cada service debe exportar funciones pequenas y explicitas.

### 5.3 Reglas para `hooks`
- `hook` maneja:
  - loading/error/success
  - polling (si aplica)
  - cancelacion en unmount
  - deduplicacion local de solicitudes
- El componente NO debe llamar `fetch` ni parsear payload complejo.

### 5.4 Regla para Pages/Components
- `pages`: orquestacion de eventos de pantalla.
- `components`: render + callbacks, sin llamadas HTTP directas.

## 6) Plan de Migracion por Fases

## Fase 0 - Baseline y seguridad
1. Documentar endpoints actuales por dominio.
2. Congelar cambios grandes de UI mientras se migra data layer.
3. Crear checklist de regresion por pantalla.

## Fase 1 - Fortalecer cliente HTTP (sin romper nada)
1. Evolucionar `src/utils/apiHelper.js` a `src/utils/api/client.js`.
2. Mantener wrappers compatibles (`apiGet`, `apiPost`, etc.) para migracion progresiva.
3. Estandarizar error object.

## Fase 2 - Crear servicios por dominio
Crear y mover llamadas en este orden:

1. `authService.js`
- login
- register
- recoverPassword
- verifyResetToken
- resetPassword

2. `dashboardService.js`
- getDashboardData (consumo + historial + alertas + config)
- saveDashboardLayout

3. `alertsService.js`
- getUserAlerts
- getNewAlertsFlag
- markAllAlertsRead
- markOneAlertRead
- getAlertThresholds
- updateAlertThresholds

4. `consumptionService.js`
- getConsumptionSummary
- getDeviceConsumptionDetail
- getHistoryDetail

5. `profileService.js`
- getProfile
- updateProfile
- changePassword
- deleteAccount

6. `devicesService.js` y `groupsService.js`
- CRUD de dispositivos/grupos
- relaciones grupo-dispositivo

7. `reportsService.js`
- createUserReport

## Fase 3 - Crear hooks de consumo de servicios
Orden recomendado:
1. `useDashboardData`
2. `useAlerts`
3. `useConsumptionSummary` + `useDeviceDetails`
4. `useProfile`
5. `useDevices` + `useGroups`
6. `useAuthApi`

## Fase 4 - Migrar archivos de alto impacto
Prioridad alta:
1. `src/pages/HomePage.jsx`
2. `src/pages/AlertasConfigPage.jsx`
3. `src/components/AuthComponents/LoginForm.jsx`
4. `src/components/AuthComponents/RegisterForm.jsx`
5. `src/components/AuthComponents/RecoverPasswordForm.jsx`
6. `src/components/AuthComponents/ResetPasswordForm.jsx`
7. `src/utils/deleteAccountService.js`

Prioridad media:
1. `src/components/HomeWidgets/SummaryWidget.jsx`
2. `src/components/HomeWidgets/TopDevicesList.jsx`
3. `src/pages/ConsumoPage.jsx`
4. `src/pages/AlertasPage.jsx`
5. `src/pages/HistorialPage.jsx`
6. `src/pages/DevicesPages.jsx`
7. `src/pages/EditGroupPage.jsx`
8. `src/pages/ProfilePage.jsx`

## Fase 5 - Limpieza y consolidacion
1. Eliminar llamadas HTTP directas en UI.
2. Eliminar parseos duplicados en paginas/componentes.
3. Centralizar adaptadores en `utils/adapters/`.
4. Dejar solo hooks en `pages/components`.

## 7) Mapa de Migracion (archivo actual -> destino)

- `src/pages/HomePage.jsx`
  - mover requests a `dashboardService.js`
  - mover estado async a `useDashboardData.js`

- `src/pages/AlertasConfigPage.jsx`
  - mover requests a `alertsService.js`
  - usar `useSettings.js` o `useAlertsSettings.js`

- `src/components/AuthComponents/*.jsx`
  - mover requests a `authService.js`
  - usar `useAuthApi.js` para estado de envio/error

- `src/utils/deleteAccountService.js`
  - integrar en `profileService.js` (una sola capa de perfil)

- `src/components/HomeWidgets/SummaryWidget.jsx`
  - evitar fetch interno
  - recibir datos desde `useDashboardData` o `useProfile`

- `src/components/HomeWidgets/TopDevicesList.jsx`
  - consumir datos de hook compartido de consumo

## 8) Decision Tecnica: React Query (opcional, recomendado)

Actualmente no esta en dependencias.

### Opcion A (sin dependencia nueva)
- Mantener hooks custom con `useEffect/useState`.
- Implementar cache simple en memoria por endpoint.
- Adecuado para migracion corta.

### Opcion B (recomendada)
- Agregar `@tanstack/react-query`.
- Beneficios:
  - cache por `queryKey`
  - retries controlados
  - deduplicacion automatica
  - invalidacion post-mutation
  - polling por query
- Ideal para Home/Alertas/Consumo con refresco frecuente.

## 9) Convenciones de Codigo propuestas

- Nombres de funciones service:
  - `getX`, `createX`, `updateX`, `deleteX`, `markX`
- Nombres de hooks:
  - `useXQuery`, `useXMutation` (si usan React Query)
  - o `useXData`, `useXActions` (si no)
- No usar `import.meta.env.VITE_BACKEND_URL` fuera de `api client`.
- Prohibir `fetch` directo en `pages` y `components`.

## 10) Definition of Done (DoD)

Se considera completa la reorganizacion cuando:
1. No existe `fetch(` fuera de `src/utils/api/*`.
2. Todas las llamadas API viven en `services`.
3. UI consume solo hooks/props.
4. Polling centralizado en hooks.
5. Errores unificados y mensajes consistentes.
6. Flujo auth (401) unificado y testeado.

## 11) Checklist de ejecucion (copiable)

- [ ] Crear `src/utils/api/client.js` y `errors.js`.
- [ ] Crear servicios por dominio (auth, alerts, dashboard, etc).
- [ ] Crear hooks por dominio.
- [ ] Migrar `HomePage`.
- [ ] Migrar `AlertasConfigPage`.
- [ ] Migrar Auth forms.
- [ ] Migrar widgets con fetch interno.
- [ ] Eliminar `fetch` directo en UI.
- [ ] Ajustar pruebas/manual QA por modulo.
- [ ] Actualizar README con arquitectura de datos.

## 12) Riesgos y mitigacion

Riesgo: romper flujos con polling.
Mitigacion: migrar por modulo, mantener wrappers backward-compatible.

Riesgo: cambios de shape de datos.
Mitigacion: usar adapters por endpoint y pruebas de contrato simples.

Riesgo: carrera de estado en unmount.
Mitigacion: cancelacion de request y guardas `isMounted`/abort.

## 13) Conclusion

La reorganizacion **si es necesaria** y vale la pena.

Impacto esperado:
- menor duplicacion
- errores mas predecibles
- mantenimiento mas rapido
- base lista para escalar nuevas features sin deuda tecnica acelerada
