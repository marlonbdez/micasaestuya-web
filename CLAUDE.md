# micasaestuya · web

Portal de clasificados inmobiliarios para Cuba y República Dominicana. Nuxt 3.

Este fichero dice **cómo se escribe** el código aquí. El **por qué está como
está** vive en `docs/`, y no se carga solo: ábrelo cuando la tarea lo pida.

| Documento               | Cuándo abrirlo                                         |
| ----------------------- | ------------------------------------------------------ |
| `docs/status.md`        | **Siempre al empezar.** Estado, siguiente paso y deuda |
| `docs/regions.md`       | Ubicación, direcciones, países o idiomas               |
| `docs/post-ad-flow.md`  | Cualquier cosa en `/post-ad`                           |
| `docs/gotchas.md`       | Algo falla de forma rara, o vas a depurar              |
| `docs/tooling.md`       | CI, lint, Docker, Code Quality                         |
| `docs/design-system.md` | Escribes SCSS                                          |

Hay skills en `.claude/skills/` que se activan solas: verificar cambios, añadir
un paso al flow, añadir textos y preparar los commits.

---

## Stack

Nuxt 3 (`ssr: false`, estático) · Vue 3 con `<script setup lang="ts">` · Pinia ·
SCSS modular con BEM y tokens · @nuxtjs/i18n · vee-validate + yup · nuxt-icons.

TypeScript estricto: sin `any`, sin props sin tipar.

```
components/base/   componentes atómicos (sin lógica de negocio)
components/        de página o sección (consumen base/ y stores)
composables/       lógica reutilizable sin UI
stores/            estado global de dominio (Pinia)
core/
  types.ts         re-exporta los tipos · NUNCA .d.ts (gotchas.md § 5)
  types/           interfaces por dominio
  services/        módulos de API (http, auth, region)
  models/          clases de dominio
  constants/       constantes y enums
pages/             rutas Nuxt, mínima lógica
layouts/           default.vue y flow.vue
locales/           traducciones
docs/              el porqué de las decisiones
```

---

## Las tres palabras del dominio

Esto es lo que más fácil es romper, y lo que más cuesta arreglar después:

- **`locale`** — país + idioma (`es-CU`, `en-DO`).
- **`region`** — un nodo del árbol administrativo: provincia, municipio,
  localidad. Nunca lleva calle ni coordenadas.
- **`address`** — la región **más** la calle y el número.

Sale del vocabulario de schema.org, que es el que Google lee. Antes de renombrar
nada en esta zona, lee `docs/regions.md`.

---

## Componentes base — úsalos siempre

| Necesitas       | Usa             | Props clave                                              |
| --------------- | --------------- | -------------------------------------------------------- |
| Botón o enlace  | `BaseCta`       | `variant`, `size: sm/md/lg`, `is-link`, `to`, `disabled` |
| Input de texto  | `BaseInput`     | `id`, `v-model`, `label`, `error-message`                |
| Elegir ficheros | `BaseFileInput` | `id`, `accept`, `multiple`, `@select` → `File[]`         |
| Dropdown custom | `BaseDropdown`  | `id`, `options: Option<T>[]`, `selected`                 |
| Select nativo   | `BaseSelect`    | `id`, `v-model`, `options: [{id, value}]`                |
| Icono           | `BaseIcon`      | `icon`, `size: xs/sm/md/lg/xl`                           |
| Checkbox        | `BaseCheckbox`  | `id`, `v-model`, `label`                                 |
| Alert           | `BaseAlert`     | `variant: error/warning/success/info`                    |
| Toggle          | `BaseSwitch`    | `v-model`                                                |
| Spinner         | `BaseSpinner`   | (sin props)                                              |

Antes de crear un elemento de UI, comprueba si ya existe. **Y pregunta antes de
modificar uno**: los usa todo el proyecto.

---

## Reglas duras

| ❌ No                                      | ✅ Sí                                  |
| ------------------------------------------ | -------------------------------------- |
| `<button>`, `<input>`, `<select>`, `<svg>` | el componente `Base*` correspondiente  |
| Texto literal en template o script         | `$t('clave.i18n')`                     |
| Rutas escritas a mano                      | `localePath('nombre-de-ruta')`         |
| Tipos en `.d.ts`                           | `.ts` — un `.d.ts` no emite JavaScript |
| `any`                                      | tipo explícito o `unknown`             |
| Colores, píxeles o fuentes a mano          | tokens (`docs/design-system.md`)       |
| `!important`                               | arreglar la especificidad              |
| `$services` en un componente               | solo en stores y composables           |
| Formulario sin validar                     | vee-validate + yup                     |
| `OperationType.Buy`                        | `OperationType.Sale`                   |

**Sobre los stores:** `@pinia/nuxt` 0.4.x **no auto-importa los stores**. Cada
uso necesita su `import` explícito, o revienta en tiempo de ejecución sin que
TypeScript avise (`gotchas.md` § 1).

---

## Cómo trabajar

- **Consulta antes de cambiar código que funciona**, aunque parezca una mejora
  obvia. Y **explica los cambios que nadie pidió**, incluidos los renombrados.
- **De menos a más.** Primera iteración, lo justo necesario. Reutiliza los enums
  y tipos que ya existen en vez de inventar vocabulario nuevo.
- **Código en inglés.** Las URLs se traducen por locale con `defineI18nRoute`.
- **Verifica en el navegador**, no des por hecho que funciona.
- Explica a nivel _mid-junior_: que se entienda el porqué, no solo que compile.

---

## Comandos

```bash
npm run dev                  # http://localhost:3000
npm run lint                 # ESLint + Prettier
npm run lint:fix             # y arregla lo que pueda
npm run test:unit:headless   # Vitest
npm run build                # lo que corre el hook pre-push
```

El stack completo se levanta con Docker Compose desde el repo `infra`. El lint
de `api` **no se puede correr desde el host**: va con
`docker compose exec express npm run lint` (`docs/tooling.md`).
