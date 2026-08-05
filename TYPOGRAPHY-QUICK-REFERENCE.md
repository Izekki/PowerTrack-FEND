# 🎯 QUICK REFERENCE - Tipografía PowerTrack

## TL;DR: LA ESCALA

```
Page Title    → --font-page-title           (28-40px / 35-50px)
Heading 1     → --font-heading-large        (24-36px / 28-40px)
Heading 2     → --font-heading-medium       (20-28px / 22-32px)
Heading 3     → --font-heading-small        (18-24px / 18-26px)
Body Reading  → --font-body-reading         (16-20px / 18-24px)
Body Interact → --font-body-interaction     (16-18px / 14-20px) ← inputs
Secondary     → --font-secondary            (14-16px / 12-18px)
Small         → --font-small                (12-14px / 11-14px)
Extra Small   → --font-extra-small          (11-13px / 10-12px) ← labels
```

## USO RÁPIDO

### Para un elemento nuevo:
```css
.mi-titulo {
  font-size: var(--font-heading-small);
  line-height: 1.2;
  font-weight: 700; /* o 600 si no es título */
}

.mi-parrafo {
  font-size: var(--font-body-reading);
  line-height: 1.5;
}

.mi-etiqueta {
  font-size: var(--font-extra-small);
  text-transform: uppercase;
  font-weight: 600;
}
```

### Inputs especial:
```css
input, button {
  font-size: var(--font-body-interaction);
  /* Automáticamente ≥16px mobile = sin zoom iOS */
}
```

## UBICACIÓN DEFINICIONES

```
src/App.css líneas 27-56    → Variables mobile
src/App.css líneas 143-152  → @media desktop override
```

## MOBILE VS DESKTOP

**Mobile:** clamp(MIN, VW, MAX)
- Escala hasta 1024px
- Comienzo del navegador con la tamaño MIN

**Desktop:** @media (min-width: 1024px)
- Aplica nuevos clamp con MAX más grande
- Ej: 28px min → 35px min

## ¿CUÁL VARIABLE USAR?

| Si quieres... | Usa... |
|---|---|
| Título grande página | `--font-page-title` |
| Encabezado de sección | `--font-heading-large` O `-medium` |
| Encabezado subsección | `--font-heading-small` |
| Texto de lectura normal | `--font-body-reading` |
| Botones / Inputs / UI | `--font-body-interaction` |
| Subtítulo / Descripción | `--font-secondary` |
| Información pequeña | `--font-small` |
| Labels / Tags | `--font-extra-small` |

## VALIDACIÓN

- ✅ Nunca escribas `font-size: 16px`
- ✅ Siempre usa `--font-*`
- ✅ Los números suben automático en mobile→desktop
- ✅ Inputs = `--font-body-interaction` (16px mín, WCAG AA)

## INFORMACIÓN

- **Estándar:** Learn UI Design by Erik Kennedy
- **Accesibilidad:** WCAG 2.1 AA/AAA
- **Responsivo:** clamp() fluido, sin breakpoints duros
- **Best Practice:** Mobile-first (definen valores, desktop override)

---

**Siguiente paso:** Cada vez que crees CSS nuevo, usa esta tabla. 📌
