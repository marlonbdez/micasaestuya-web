# Sistema de diseño

SCSS, tokens y tipografía. Está aparte de `CLAUDE.md` porque solo hace falta
cuando se escribe estilo, y ocupa más que todo lo demás junto.

La regla de fondo es una: **ningún valor a mano**. Si escribes un color, un
píxel o un peso de fuente literal, existe un token que deberías estar usando.

---

## Imports siempre con `@use`

```scss
<style lang="scss" scoped>
@use '~/assets/scss/abstract/_mixins.scss' as *;
@use '~/assets/scss/tokens/_spacing.scss' as *;

// Ahora disponibles:
// Mixins: @include media-breakpoint-up(sm/md/lg)
// Spacing: $gap-extra-tiny, $gap-tiny, $gap-small, $gap-medium, $gap-large, $gap-huge
```

## Variables CSS disponibles

```
--bg / --bg-2 / --bg-3              fondos (cambian en dark mode)
--text / --text-2 / --text-3        tipografía
--border                            bordes
--warm: #C8956C                     terracota (usar con moderación)
--radius: 14px                      cards
--radius-sm: 8px                    inputs
--radius-pill: 100px                botones, badges
--font: 'Outfit', -apple-system...  tipografía
--card-shadow / --card-shadow-hover sombras
```

---

## Shimmer para placeholders de imágenes

```scss
// ✅ Patrón estándar — CSS puro, sin JS
.property-card__image {
  background: var(--bg-2);
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.15) 50%,
      transparent 100%
    );
    animation: shimmer 1.5s infinite;
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
```

---

## BEM — obligatorio en todos los componentes

```scss
/* ✅ Correcto */
.home-search {
}
.home-search__field {
}
.home-search__field--guests {
} /* modifier */
.home-search__submit {
}

/* ❌ Incorrecto — clases planas sin bloque padre */
.search-field {
}
.search-btn {
}
```

**Regla:** cada componente Vue tiene un único bloque BEM raíz que coincide con el nombre semántico del componente (kebab-case). Todos los elementos son `__element` y los modificadores `--modifier`.

## `px-to-rem()` — función obligatoria para valores en píxeles

La función está disponible globalmente via `nuxt.config.ts` (no importar manualmente).

```scss
/* ✅ Correcto */
width: px-to-rem(380);
height: px-to-rem(56);
font-size: px-to-rem(14);
gap: px-to-rem(8);

/* ❌ Incorrecto */
width: 380px;
height: 56px;
```

**Excepciones aceptadas:** `blur()`, `border: 1px solid` (hairlines decorativas), SVG `width`/`height` attributes en HTML (no CSS).

## CSS custom properties — usar los tokens semánticos

```scss
/* ✅ Sistema de diseño */
color: var(--text); /* no var(--zinc-700) directamente */
background: var(--bg);
border-color: var(--border);
background: var(--accent);
transition: all var(--transition);
border-radius: var(--radius-pill);

/* ❌ Valores hardcodeados */
color: #3f3f46;
background: white;
border-color: #d4d4d8;
```

## Tipografía — mixins Outfit

```scss
/* ✅ Mixins actuales */
@include font-outfit-light; /* 300 */
@include font-outfit-regular; /* 400 */
@include font-outfit-medium; /* 500 */
@include font-outfit-semibold; /* 600 */

/* Mixins de escala tipográfica */
@include label; /* campo de form: uppercase, 600, letter-spacing */
@include caption; /* texto auxiliar pequeño */
@include h1 / h2 / h3 / h4;
@include body-regular / body-small;

/* ⚠️ DEPRECATED — no usar en código nuevo */
@include font-roboto-condensed-regular; /* alias → font-outfit-medium */
@include font-roboto-condensed-light; /* alias → font-outfit-light */
```

## Breakpoints — siempre con mixin

```scss
/* ✅ Mobile-first */
@include media-breakpoint-up(sm) {
} /* ≥ 768px */
@include media-breakpoint-up(md) {
} /* ≥ 992px */
@include media-breakpoint-down(xs) {
} /* ≤ 640px — mobile only */

/* ❌ Media queries raw */
@media (max-width: 640px) {
}
```

## Tokens disponibles (variables SCSS)

| Variable                 | Valor             | Uso                  |
| ------------------------ | ----------------- | -------------------- |
| `$corner-radius-sm`      | `0.5rem` (8px)    | inputs, chips        |
| `$corner-radius-md`      | `0.875rem` (14px) | cards, modales       |
| `$corner-radius-pill`    | `6.25rem` (100px) | botones, badges      |
| `$gap-tiny`              | `0.125rem`        | gaps mínimos         |
| `$gap-small`             | `0.5rem`          | gaps pequeños        |
| `$gap-medium`            | `1rem`            | padding estándar     |
| `$gap-extra-medium`      | `1.5rem`          | separación secciones |
| `$zindex-modal-backdrop` | `1040`            | modales              |
