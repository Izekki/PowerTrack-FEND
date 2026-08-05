# 🎨 Sistema de Diseño y Guía de Estilos - PowerTrack

Este documento resume las pautas de tipografía responsiva e íconos utilizadas en la interfaz de **PowerTrack**.

---

## 📐 Escala Tipográfica y Variables CSS

PowerTrack emplea una escala tipográfica fluida basada en funciones `clamp()` y variables CSS globales definidas en `src/App.css`.

### Escala de Fuentes

| Elemento | Descripción / Uso | Variable CSS |
|---|---|---|
| **Título Principal** | Encabezados de páginas primarias | `--font-page-title` |
| **Encabezado Grande** | Secciones destacadas en dashboards | `--font-heading-large` |
| **Encabezado Medio** | Títulos de tarjetas y modales | `--font-heading-medium` |
| **Encabezado Pequeño** | Subsecciones | `--font-heading-small` |
| **Cuerpo (Lectura)** | Parrafos principales de información | `--font-body-reading` |
| **Cuerpo (Interacción)** | Textos dentro de `input` y `button` | `--font-body-interaction` |
| **Texto Secundario** | Descripciones breves y subtítulos | `--font-secondary` |
| **Texto Pequeño** | Notas al pie e indicadores | `--font-small` |
| **Etiquetas / Captions** | Tags, badges y etiquetas de campos | `--font-extra-small` |

### Reglas de Uso Tipográfico
- **Variables CSS Obligatorias**: Usar siempre `var(--font-*)` en los archivos CSS en lugar de valores hardcoded en píxeles.
- **Inputs Móviles**: El tamaño mínimo para campos interactivos en móvil es de 16px para evitar el zoom automático en navegadores móviles (iOS Safari).

---

## 🖼️ Manejo de Íconos SVG

Para mantener la nitidez en pantallas de alta densidad y permitir cambios dinámicos de color en modo oscuro/alto contraste:
- **Íconos del Sidebar e Interfaz**: Se prefiere el uso de componentes SVG en línea (`stroke="currentColor"` / `fill="currentColor"`) sobre imágenes PNG estáticas.
- **Ventaja**: Heredan automáticamente los colores del tema visual activo del usuario.
