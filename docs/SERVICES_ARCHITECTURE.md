# 🏗️ Arquitectura de Servicios y Capa de Datos

**PowerTrack-FEND** utiliza un patrón estructurado en capas para la comunicación HTTP, desacoplando la lógica de transporte de la interfaz de usuario.

---

## 🧩 Capas de la Arquitectura

```
  ┌────────────────────────────────────────┐
  │         Páginas / Componentes UI       │
  └───────────────────┬────────────────────┘
                      │ Consumen únicamente
                      ▼
  ┌────────────────────────────────────────┐
  │        Custom Hooks (`src/hooks`)      │
  └───────────────────┬────────────────────┘
                      │ Invocan
                      ▼
  ┌────────────────────────────────────────┐
  │      Servicios por Dominio (`services`) │
  └───────────────────┬────────────────────┘
                      │ Usan
                      ▼
  ┌────────────────────────────────────────┐
  │      Cliente API Base (`client.js`)     │
  └────────────────────────────────────────┘
```

---

## 📦 Componentes Principales

### 1. Cliente API Centralizado (`src/utils/api/client.js`)
- Gestiona todas las peticiones HTTP (`apiFetch`, `apiGet`, `apiPost`, `apiPut`, `apiPatch`, `apiDelete`).
- Agrega automáticamente el encabezado `Authorization: Bearer <token>` cuando existe sesión activa.
- Normaliza errores HTTP (401 Expirado, 403 Prohibido, 500 Servidor) mediante la clase `ApiError`.

### 2. Servicios por Dominio (`src/utils/services/`)
- Módulos especializados sin estado de React que encapsulan las llamadas a endpoints específicos:
  - `authService.js`: Inicio de sesión, registro y recuperación de contraseña.
  - `alertsService.js`: Obtención y actualización de alertas de consumo.
  - `dashboardService.js`: Métricas y resúmenes energéticos principales.
  - `contactService.js`: Envío de formularios de soporte técnico.
  - `preferencesService.js`: Sincronización de preferencias y tema visual.

### 3. Custom Hooks de React (`src/hooks/`)
- Manejan el estado asíncrono (`loading`, `error`, `data`) y ciclo de vida para los componentes presentacionales.

---

## 🔒 Reglas Técnicas
1. **Sin `fetch` directo en UI**: Ninguna página o componente JSX debe realizar peticiones `fetch` directamente; deben utilizar los servicios o hooks correspondientes.
2. **Manejo Único de Tokens**: La lectura e inyección de tokens de sesión se realiza exclusivamente dentro del cliente API.
