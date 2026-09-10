# Herramientas: CI, lint y entorno

Trampas del toolchain, que son distintas de los errores de código porque no las
detecta ejecutar la aplicación: todo funciona en local y falla en el CI.

## 1. Que Node lo ejecute no significa que el linter lo entienda

`models/region.js` cargaba el árbol así:

```js
import regionsCU from '../data/regions_cu.json' with { type: 'json' }
```

Funcionaba perfectamente en local y el endpoint respondía. Pero el CI falló con
`Parsing error: Unexpected token with`. Los _import attributes_ son ES2025:
Node los ejecuta, **ESLint 8 no los parsea**, y no hay `ecmaVersion` que lo
arregle — probamos 2023, 2024, 2025 y `latest`. El soporte llega en ESLint 9,
que obliga a migrar a flat config, y `eslint-config-standard@17` aún no lo
soporta.

Se resolvió sin tocar la versión de ESLint:

```js
const readTree = (file) =>
  JSON.parse(readFileSync(new URL(`../data/${file}`, import.meta.url), 'utf8'))
```

Corre una sola vez al arrancar, igual que el import.

**Lo que enseña:** "funciona en mi máquina" y "pasa el lint" son dos preguntas
distintas, y el toolchain puede ir por detrás del runtime. Además, esto se nos
escapó porque `api/node_modules` está **vacío en el host** — las dependencias
viven en el volumen de Docker — así que el lint de `api` no se puede ejecutar
desde fuera del contenedor. Para correrlo:
`docker compose exec express npm run lint`.

De paso, `utils/redisSeed.js` salió de `.eslintignore` (que quedó vacío y se
borró) y pasó a estilo `standard`. Ojo con un detalle al hacerlo: el parámetro
`country_code` tuvo que pasar a `countryCode` por la regla `camelcase`, pero el
campo que se guarda en Redis **sigue siendo `country_code`**, porque es el
contrato que leen el modelo y el frontend:

```js
const hashValue = { term, country_code: countryCode, ..., level_type: levelType }
```

## 2. Cuando la métrica mide la unidad equivocada

El job de Code Quality reportó `useRegionSuggest` con 73 líneas (máximo 25) y
complejidad cognitiva 16 (máximo 5), y `useRegionCascade` con 49 y 11.

Lo primero que hay que mirar en ese informe es que `useLocationSuggest` aparecía
como **Fixed** y `useRegionSuggest` como hallazgo nuevo: es el mismo código
renombrado. El neto era cero. Un informe de calidad puede parecer una regresión
cuando solo ha habido un `git mv`.

Y los umbrales por defecto miden mal aquí. **Un composable es un módulo
disfrazado de función**: declara estado, declara manejadores y devuelve. Code
Climate cuenta todo el cuerpo de `useX()` como un método, así que cualquier
composable con tres o cuatro funciones dentro se pasa de 25. Y el 5 de
complejidad cognitiva es agresivo: SonarQube usa 15 para la misma métrica.

Un informe que es ruido se deja de leer, que es la peor forma de tener una
herramienta. La primera reacción fue subir los umbrales con un
`.codeclimate.yml`, pero al mirar la documentación apareció algo mejor.

**Pero la métrica sí apuntaba a algo real en un sitio.** Lo difícil de
`useRegionSuggest` no es su longitud: son **tres variables mutables fuera del
sistema reactivo** (`debounceTimer`, `isRequestBlocked`, `skipNextSearch`) más
una llamada recursiva —`search()` se llama a sí misma desde el `finally`—. Por
eso marca 16 y la cascada, que solo tiene funciones puras encadenadas, marca 11.
Eso es deuda de verdad y está anotada en `status.md`. La cascada, en cambio,
se queda como está: partirla solo repartiría el mismo problema en dos ficheros.

## 3. Y por qué al final quitamos Code Climate del todo

GitLab **deprecó** el escaneo basado en Code Climate en la 17.3 y lo elimina en
la 19.0. Así que subir umbrales habría sido afinar una herramienta con fecha de
caducidad. En su lugar, el informe lo genera ahora **nuestro propio ESLint**:

- Fuera el `template: Code-Quality.gitlab-ci.yml` del `include`.
- El job `lint` corre `npm run lint:js -- --format gitlab` y publica
  `gl-code-quality-report.json` como artefacto `codequality`, con
  `when: always` para que el informe suba también cuando el lint falla.
- `.codeclimate.yml` borrado.

Lo importante no es quitarse la deprecación, es que **ahora hay una sola fuente
de verdad**. Antes había dos herramientas opinando sobre el mismo código con
criterios distintos, y la que mandaba en el merge no era la misma que la que
mandaba en tu editor.

**Dos trampas al hacerlo:**

`eslint-formatter-gitlab@6` en adelante exige **ESLint 9**, y el repo va por el 8. La última compatible es la **5.1.0** (`peerDependencies: eslint >=5`). Si se
instala a ciegas con `@latest`, npm falla con `ERESOLVE`, y forzarlo con
`--legacy-peer-deps` instalaría un paquete que usa APIs que tu ESLint no tiene.

Y se pierde la métrica de complejidad, que era lo único que Code Climate
aportaba de más. Se recupera con la regla propia de ESLint, en `.eslintrc.cjs`:

```js
complexity: ['error', 10]
```

Con una diferencia que importa: **ESLint mide por función real, no por
composable entero**. Medido antes de fijar el umbral, lo más complejo del repo
marcaba 5. Es exactamente la confirmación de que Code Climate estaba contando
la unidad equivocada.

---
