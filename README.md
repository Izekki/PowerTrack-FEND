# ⚡ PowerTrack - Monitoreo y Optimización Energética

**PowerTrack** es una plataforma web integral diseñada para el seguimiento, monitoreo y análisis inteligente del consumo de energía eléctrica en tiempo real. La solución permite a usuarios y organizaciones visibilizar de forma clara su comportamiento energético, optimizar costos y tomar decisiones informadas sobre el uso de sus dispositivos eléctricos.

---

## 🎯 Propósito Principal y Problema que Resuelve

El aumento continuo en las tarifas eléctricas y la falta de información detallada dificultan la gestión eficiente de la energía. **PowerTrack** resuelve este problema ofreciendo una interfaz centralizada e interactiva que transforma datos complejos de consumo en métricas claras, alertas tempranas y recomendaciones personalizadas.

### Objetivos Clave:
- 📉 **Reducir el desperdicio energético**: Identificar aparatos con consumo anómalo o ineficiente.
- 💰 **Prevenir sobrecostos**: Evitar sorpresas en la factura mediante alertas automáticas de umbrales máximos.
- 📊 **Visualización clara**: Proporcionar información en tiempo real e histórica mediante gráficas e indicadores dinámicos.
- ⚡ **Alinear ciclos de consumo**: Configurar fechas de corte personalizadas coincidiendo con el proveedor de energía.

---

## ✨ Funcionalidades para el Usuario Final

### 1. 🖥️ Dashboard Principal y Visualización en Tiempo Real
- Resumen ejecutivo del consumo actual en kilovatios-hora (kWh) y estimación de costos.
- Tarjetas informativas dinámicas (Summary Widgets) con estado general del sistema.
- Indicadores visuales instantáneos de demanda eléctrica y tendencias de uso.

### 2. 📊 Monitoreo Detallado y Análisis de Consumo
- Desglose del consumo energético por dispositivo individual y grupos asignados.
- Gráficas interactivas que comparan hábitos de consumo en diferentes horas y días.
- Visualización de datos estadísticos para identificar patrones y picos de demanda.

### 3. 📈 Registro Histórico de Energía
- Historial completo de lecturas y consumo energético acumulado.
- Exportación de reportes detallados y análisis de consumo para auditorías energéticas.
- Comparativa entre ciclos de facturación pasados y el ciclo activo.

### 4. 🔌 Gestión de Dispositivos y Grupos
- Registro, edición y organización de dispositivos eléctricos por área o categoría (ej. cocina, oficina, climatización).
- Asignación de parámetros específicos por dispositivo e íconos identificativos.
- Filtros rápidos y búsquedas avanzadas para localizar componentes en la red.

### 5. 🚨 Sistema Inteligente de Alertas y Notificaciones
- Configuración de límites y umbrales de consumo por dispositivo o nivel general.
- Alertas en tiempo real cuando un dispositivo supera la potencia máxima permitida.
- Panel de control de alertas activas con historial de incidencias registradas.

### 6. 📅 Configuración de Fechas de Corte de Facturación
- Sincronización del ciclo de medición de la aplicación con la fecha de corte real del proveedor de servicios eléctricos.
- Proyección de consumo estimado hacia el cierre del periodo de facturación.

### 7. 🎨 Personalización y Accesibilidad
- Modo de **Alto Contraste** y soporte para temas de visualización adaptables.
- Ajustes de perfil de usuario, preferencias de interfaz y gestión segura de credenciales.
- Interfaz completamente responsiva optimizada para ordenadores de escritorio y dispositivos móviles.

### 8. ❓ Centro de Ayuda y Soporte Técnico
- Guías de uso rápido, preguntas frecuentes y consejos de eficiencia energética.
- Formulario de contacto directo con el equipo de soporte técnico.

---

## 🛠️ Arquitectura y Tecnologías de Producción

- **Frontend Core**: [React](https://reactjs.org/) (Single Page Application con hooks y estado centralizado)
- **Tooling & Build**: [Vite](https://vitejs.dev/) (Empaquetado optimizado para alto rendimiento en producción)
- **Visualización de Datos**: [Chart.js](https://www.chartjs.org/) & React-Chartjs-2 (Gráficas interactivas en tiempo real)
- **Estilos & Diseño**: Vanilla CSS modular, variables CSS responsivas y soporte de accesibilidad / alto contraste
- **Integración API**: Capa centralizada de transporte HTTP (`apiFetch`) con soporte para tokens de sesión y manejo unificado de errores

---

## 👥 Autores y Desarrollo

Proyecto desarrollado y mantenido por el equipo **PowerTrack**:
- [@Izekki](https://github.com/Izekki)
- [@ElMilaneso-69](https://github.com/ElMilaneso-69)
- [@McFlyer-00](https://github.com/McFlyer-00)
- [@Transformiuo](https://github.com/Transformiuo)
