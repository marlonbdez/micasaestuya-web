# Errores que ya cometimos

Catálogo de fallos reales de este proyecto, con lo que enseña cada uno. No es
una lista de anécdotas: casi todos volverían a pasar, porque la causa sigue ahí.

Léelo antes de depurar algo raro. Hay una probabilidad decente de que ya esté.

### 1. Los auto-imports de Nuxt no cubren los stores

```
ReferenceError: useAdFlowStore is not defined
```

Nuxt auto-importa muchísimo, y es fácil asumir que auto-importa todo. **No
auto-importa los stores de Pinia en esta versión**: `@pinia/nuxt@0.4.11` solo
registra sus propias composables; la opción `storesDirs` llegó en la 0.5.

**Cómo detectarlo:** si algo "no está definido" pero existe, mira cómo lo hace
el código que ya funciona.

### 2. Un error puede disfrazarse de otro

El bug anterior produjo tres mensajes distintos:

```
Cannot read properties of undefined (reading 'length')
$setup.t is not a function
```

Cuando `setup()` lanza una excepción, Vue nunca construye el objeto que expone
al template — ese objeto es `$setup`. El render se ejecuta igual, lo encuentra
vacío y se queja de la primera propiedad que toca.

**La lección:** un error en `_sfc_render` que dice que algo del `<script setup>`
no existe suele ser un síntoma. Busca el primer error de la consola.

### 3. `await` en el nivel superior de `<script setup>`

Convierte el componente en **async**, y uno async necesita un `<Suspense>`
alrededor para renderizar. Lo hace **siempre**, aunque el `if` que lo rodea sea
falso: cuenta la presencia del `await`.

### 4. Parsear la URL cuando la URL está traducida

Los slugs de `STEPS` están en inglés, pero la URL en español acaba en
`datos-basicos`, así que `STEPS.indexOf(slug)` daba `-1` siempre. El indicador se
habría quedado clavado en el paso 1 sin lanzar ningún error.

**Regla:** con i18n, la URL es presentación. Para lógica, usa nombres de ruta.

### 5. Enums dentro de un `.d.ts`

Nos mordió cuatro veces. TypeScript tiene dos mundos: los **tipos** solo existen
al compilar y desaparecen del JavaScript; los **valores** existen al ejecutar. Un
`enum` es **las dos cosas**.

Un `.d.ts` describe formas y **nunca genera JavaScript**. Así que:

```ts
const x: LevelType = ...      // funciona: solo necesita la descripción
const y = LevelType.Level3    // explota: no hay nada que ejecutar
```

Los síntomas fueron variados y ninguno señalaba la causa: el HMR no recargaba
los cambios de tipos, `AdCategory` "no exportado", y un `Failed to resolve
import` el día que usamos el enum como valor.

**La regla:** tu código va en `.ts`; los `.d.ts` son para describir código ajeno.
Efecto colateral útil al migrar: ESLint empezó a analizarlos y encontró tres
interfaces usadas antes de declararse.

### 6. `BaseSelect` nunca emitió nada

```js
if (event.target instanceof HTMLInputElement) {   // sobre un <select>
```

`HTMLSelectElement` y `HTMLInputElement` son clases **hermanas**: ninguna hereda
de la otra. La condición era siempre falsa, así que el `emit` no se ejecutaba
jamás y el `v-model` de cualquier `BaseSelect` no se actualizaba.

Llevaba roto desde siempre sin que se notara, porque el único uso era el selector
de tipo de propiedad de la home y ese valor no se envía a ningún sitio.

**Cómo se verificó:** cambiar el valor del DOM no prueba nada, porque el DOM
cambia igual. Hay que forzar un re-render de Vue tocando otro control y ver si
el select conserva el valor nuevo o Vue lo revierte.

### 7. Una cadena a medio pasar

Al refactorizar la cascada a arrays introduje esto: `fetchChildren` recibía la
cadena completa pero solo reenviaba `parents[0]` y `parents[1]`. Al elegir en el
tercer nivel, la petición seguía pidiendo los hijos del municipio, devolvía otra
vez las localidades, y añadía un cuarto desplegable. Y un quinto. En la pantalla
aparecían `location.level4`, `level5`, `level6` con la misma opción repetida.

La versión anterior no lo tenía porque `selectLevel3` no pedía nada. **Un
refactor correcto en lo conceptual puede introducir un fallo en los bordes**: aquí,
el borde era el último nivel.

### 8. Bugs preexistentes que salieron al reutilizar código

Al extraer el autocompletado aparecieron dos: el backend resalta con `<b>` y el
parser solo contemplaba `<mark>`, así que se veía `La <b>Haba</b>na` literal; y
`isSearchDisabled` se ponía a `true` al seleccionar y **nunca volvía a `false`**.

### 9. `.container` no sabe que es un contenedor flex

`.container` lleva un clearfix (`::before` y `::after` con `display: table`).
Dentro de un contenedor `flex` con `justify-content: space-between` esos
pseudoelementos son dos elementos flex más, y el logo del header quedaba a unos
200 px del borde izquierdo en vez de pegado a él.

**Cómo detectarlo:** mide con `getBoundingClientRect()` y compara con el borde
del contenido de la página. **Solución:** `content: none` en los pseudoelementos
del contenedor flex (`TheHeader`).

### 10. Dos `z-index` iguales se resuelven por el orden del DOM

`$zindex-radio` vale 1020, lo mismo que `$zindex-sticky`. Como el radio va
después en el DOM, tapaba el panel del menú de usuario, que cuelga del header
sticky. El header usa `$zindex-fixed`. **Lo que enseña:** un panel desplegable
compite con el `z-index` de su contenedor, no con el suyo.

### 11. Validar un checkbox obligatorio con yup

`boolean().required()` deja pasar `false`: solo rechaza `undefined`. Un usuario
que marca el checkbox y lo desmarca supera la validación. `boolean().isTrue()`
sí exige `true`, pero deja pasar `undefined`, así que el campo necesita un valor
inicial `false` (`publish-listing/index.vue`).

`SignUp.vue` valida los términos con `bool().required()`: solo protege mientras
el usuario no toque el checkbox.

### 12. Probar un componente que usa composables de Nuxt

El entorno de tests es `jsdom`, sin instancia de Nuxt: `useLocalePath` o
`useColorMode` fallan con `[nuxt] instance unavailable`, y `NuxtLink` y
`nuxt-icons` también. El entorno `nuxt` de `@nuxt/test-utils` pide `happy-dom`,
que no está instalado. `UserMenu.spec.ts` lo resuelve con `vi.mock` de la ruta
relativa del fichero del composable (el paquete no exporta subrutas) y con
`stubs` de `BaseCta` y `BaseIcon`. Comprueba el comportamiento, no el aspecto.

### 13. `onClickOutside` ignora el segundo clic del mismo tick

Un test que hace clic dentro y enseguida fuera no cierra nada. Un usuario real
nunca hace las dos cosas en el mismo tick: `test/helpers/click-outside.ts`
espera uno entre ambos.

---

## Los guardarraíles que sí están en el código

Las filas de `post-ad.vue`, `basic-info.vue`, `address.vue`, `adFlow.ts` e
`IAdAddress` son del flow de publicar anuncio, anterior al pivote
(`post-ad-flow.md`). Siguen siendo ciertas mientras ese código exista; si se
reescribe o se borra, se quitan de aquí con él.

| Dónde                                          | Qué protege                                                                                  |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `post-ad.vue` · `STEPS`                        | Identificarse falta a propósito; parece un paso olvidado.                                    |
| `post-ad.vue` · `hydrate()`                    | Va en el `setup`, no en `onMounted`, o los hijos leen el borrador vacío.                     |
| `post-ad.vue` · `currentStepName`              | Por nombre de ruta, no por path (ver § 4).                                                   |
| `post-ad.vue` · `.post-ad`                     | El `max-width` vive aquí; si cada paso pone el suyo, se desalinean.                          |
| `post-ad.vue` · `__nav`                        | La navegación vive en el layout para no duplicarla cinco veces.                              |
| `index.vue` · `middleware`                     | `useLocalePath()` va dentro; `definePageMeta` se extrae fuera del setup.                     |
| `basic-info.vue` · `--joined`                  | `gap: 0` y `nowrap` parecen un descuido: el modo `inline` une bordes con márgenes negativos. |
| `basic-info.vue` · `__option`                  | El `line-height` de `BaseRadioButton` está pensado para una sola línea.                      |
| `useRegionCascade.ts` · `select`               | El truncado con `slice` es lo que invalida los niveles inferiores.                           |
| `RegionCascade.vue` · `toSelectOptions`        | La opción vacía hace de placeholder; un `<select>` nativo no tiene ese atributo.             |
| `RegionSuggest.vue` · `getLevelName`           | La clave es el nivel, no su nombre: en RD el nivel 3 es "Sector".                            |
| `RegionSuggest.vue` · `dropdown__content`      | `BaseDropdown` ancla el panel a la derecha, pensado para selectores estrechos.               |
| `useRegionSuggest.ts` · `skipNextSearch`       | Escribir la opción elegida en el campo no debe relanzar la búsqueda.                         |
| `useRegionSuggest.ts` · `parseHighlightedText` | Se trocea en segmentos en vez de usar `v-html`: sería una vía de XSS.                        |
| `BaseSelect.vue` · `updateModelValue`          | `HTMLSelectElement`, no `HTMLInputElement` (ver `gotchas.md` § 6).                           |
| `adFlow.ts` · `STORAGE_KEY`                    | La versión en la clave no es decorativa (`post-ad-flow.md` § 5).                             |
| `adFlow.ts` · `hydrate`                        | La mezcla de `address` va aparte; el spread plano dejaría `street` sin definir.              |
| `address.vue` · `update`                       | El parche se arma sobre la dirección actual: sin el spread, la calle borraría la región.     |
| `core/types.ts` · `IAdAddress`                 | Región y calle anidadas: cada parte tiene su dueño y no se pisan.                            |

---

Las trampas equivalentes de `api` están en `micasaestuya-api/docs/gotchas.md`.
