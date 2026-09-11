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

## 4. `nuxt build` no sirve para desplegar con `nitro.preset: 'static'`

Migrando el pipeline de GitLab a GitHub Actions montamos un job `build` que
corría `npm run build` (igual que el `build-app` original en GitLab) y subía
`.output` como artefacto para los tests e2e. El job "pasaba", pero
`actions/upload-artifact` avisaba: `No files were found with the provided
path: .output .nuxt`. El e2e fallaba después con "Artifact not found".

`nuxt build` sí generó archivos — se ven pasar por `.nuxt/dist/client/` en el
log — pero con `nitro: { preset: 'static' }` en `nuxt.config.ts`, ese preset
está pensado para `nuxt generate`, no para `build`: no llega a materializar
un `.output` final utilizable. Iba a "compilar" en CI sin producir nada.

Nadie lo había notado porque el job de e2e en GitLab tenía
`allow_failure: true` — un fallo silencioso desde siempre, probablemente. Lo
delató migrar a GitHub Actions y mirar los logs, no un cambio de código.

**La pista ya estaba delante:** tanto `Dockerfile.prod` como `.netlify.toml`
usan `npm run generate`, nunca `build`. Ese es el comando que de verdad se
despliega.

Arreglo en el CI:

- El job `build` ahora corre `npm run generate` y sube solo `.output/public`.
- El job `e2e` ya no usa `npm run serve` (`nuxt start`, que necesita
  `.output/server` — tampoco existe con preset `static`). En su lugar sirve
  `.output/public` con `npx serve`, igual que lo sirve Netlify en producción,
  y corre Cypress contra eso directamente.

**Lo que enseña:** un job verde no es lo mismo que un job que produjo algo.
`if-no-files-found: warn` (el default de `upload-artifact`) deja pasar un
build vacío sin fallar nada — vale la pena poner `if-no-files-found: error`
en artefactos que otro job necesita de verdad, para no volver a depender de
mirar el log a mano.

## 5. El e2e necesita `NUXT_PUBLIC_API_BASE` también en el job de tests

Con el fix del punto 4, `build` y `e2e` ya funcionaban por separado, pero
Cypress seguía fallando: los 5 tests de `auth.cy.ts` se saltaban con "1
failing" en el hook `before all`, con este error:

```
CypressError: `cy.request()` failed trying to load:
http://localhost:3001/api/health
Error: connect ECONNREFUSED 127.0.0.1:3001
```

`cypress/support/e2e.ts` tiene un `before()` global que hace un `HEAD` a
`${API_BASE}/health` para despertar la API de Render antes de correr
cualquier test (el plan free de Render duerme el servicio). `API_BASE` sale
de `cypress.config.ts`:

```ts
const apiBase = process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3001/api'
```

En GitLab esto funcionaba porque `NUXT_PUBLIC_API_BASE` estaba en las
`variables:` globales del pipeline, así que llegaba a todos los jobs,
incluido `test:e2e`. Al migrar, ese env solo se puso en el paso `npm run
generate` del job `build` - el job `e2e` corre en un job (y hasta un
`container:`) distinto y no lo heredaba, así que caía al default
`localhost:3001`, donde no hay nada escuchando en CI.

Arreglo: el paso "Run Cypress shard" del job `e2e` ahora también fija
`NUXT_PUBLIC_API_BASE: https://micasaestuya-api.onrender.com/api`.

**Lo que enseña:** en GitLab CI, las `variables:` de nivel de pipeline se
comparten entre jobs por defecto. En GitHub Actions no hay equivalente
automático - cada `env:` es local al job o al step donde se declara, así que
cualquier variable que el código realmente necesite en tiempo de ejecución
(no solo en build) hay que repetirla explícitamente en cada job que la usa.

## 6. En un job con `container:`, un proceso en segundo plano no sobrevive al siguiente step

Con el fix del punto 5, el hook `before all` ya no fallaba, pero el primer
test seguía cayendo, esta vez en `before each`:

```
CypressError: `cy.visit()` failed trying to load:
http://localhost:3000/
Error: connect ECONNREFUSED 127.0.0.1:3000
```

Lo raro es que los steps previos, "Serve static build" y "Wait for
server", habían terminado en verde - `wait-on` había confirmado que el
puerto 3000 respondía. Pero para cuando corría Cypress, ya no había nada
escuchando ahí.

El job `e2e` corre dentro de un `container:` (la imagen de Cypress). En un
job así, GitHub Actions ejecuta cada step como un `docker exec` separado.
Un proceso lanzado en segundo plano con `&` en un step vive dentro de esa
sesión de `exec` - cuando el step termina, la sesión se cierra y el
proceso se mata con ella, aunque el step "haya terminado bien". `serve`
arrancaba, `wait-on` alcanzaba a verlo vivo en esa misma ventana, y se
moría antes de que arrancara el step de Cypress.

(El job `accessibility` usa el mismo patrón de tres steps separados y
nunca dio este problema, porque ese job corre directo en el runner -`runs-on: ubuntu-latest` sin `container:`- donde sí sobreviven los
procesos en segundo plano entre steps.)

Arreglo: en el job `e2e`, los tres steps -arrancar `serve`, esperar con
`wait-on` y correr Cypress- se unieron en uno solo, así el proceso en
segundo plano y todo lo que depende de él viven en la misma sesión de
`docker exec` de principio a fin.

**Lo que enseña:** un step en verde no garantiza que lo que dejó corriendo
en segundo plano siga vivo en el siguiente. Es justo el mismo patrón que
el punto 4 (`if-no-files-found: warn`) y el punto 5 (env no heredado):
GitHub Actions no comparte tanto estado entre steps como parece a primera
vista, sobre todo dentro de un `container:`. La forma más simple de
evitarlo es no depender de que algo backgrounded cruce el límite entre
steps.

---
