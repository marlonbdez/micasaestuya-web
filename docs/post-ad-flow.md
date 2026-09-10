# El flow de publicar anuncio

Guía de `/post-ad`: qué construimos y **por qué está así**. Los conceptos de
Nuxt que hay detrás —routing anidado, URLs traducidas, layouts— y las decisiones
de producto que condicionan el resto.

- Cómo se modela la ubicación → `regions.md`
- Errores que ya cometimos → `gotchas.md`
- Estado y siguiente paso → `status.md`

> **Convención de comentarios.** El código casi no lleva comentarios: las
> explicaciones viven en estos documentos. Los pocos que quedan son
> guardarraíles de una línea que impiden una regresión concreta, y están
> listados en `gotchas.md`. Si borras uno, rompes algo.

---

## 1. El mapa

```
pages/
  post-ad.vue              ← LAYOUT del flow: indicador de pasos + navegación
  post-ad/
    index.vue              ← /post-ad a secas → redirige al paso 1
    basic-info.vue         ← Paso 1: tipo de inmueble + operación
    address.vue            ← Paso 2: región (cascada) + calle y número
    details.vue            ← Paso 3: precio, superficie, habitaciones, baños
    photos.vue             ← Paso 4: elegir fotos y verlas en miniatura

layouts/
  flow.vue                 ← header solo con logo, footer solo con copyright

components/
  RegionCascade.vue        ← los desplegables encadenados de región
  RegionSuggest.vue        ← autocompletado de región (lo usa la home)
  LocaleModal.vue          ← elegir país e idioma
components/base/
  BaseStepIndicator.vue    ← la cifra "01 / 05" y la barra de progreso
  BaseFileInput.vue        ← elegir ficheros; emite File[], no toca el borrador

composables/
  useRegionCascade.ts      ← la lógica de la cascada
  useRegionSuggest.ts      ← debounce + petición + parseo del resaltado
  usePhotoDb.ts            ← IndexedDB: guardar, leer y borrar las fotos
  useImageResize.ts        ← reescalar con canvas antes de guardar
  useAdPhotos.ts           ← une borrador, IndexedDB y las URLs de vista previa

stores/
  adFlow.ts                ← el borrador, su persistencia y la validación por paso
  region.ts                ← la región elegida en el buscador de la home

core/types.ts              ← IAdDraft, IAdAddress, IAdRegion, PropertyType, OperationType
core/types/region.ts       ← IRegion, IRegionNode, LevelType
core/localeUtils.ts        ← getLocale(), i18nLocales
locales/es.json, en.json   ← textos

api/models/region.js       ← suggest (Redis) + children (jerarquía)
api/controllers/region.js
api/routes/regions.js
api/data/regions_*.json    ← el árbol administrativo, fuente de verdad
```

Archivos que ya existían y tocamos: `TheHeader.vue` y `TheFooter.vue` (prop
`minimal`, y sus enlaces apuntaban mal), `HomeSearchSuggest.vue` (de 268 líneas
a 30), `HomeSearch.vue` (`OperationType.Buy` → `Sale`) y `BaseSelect.vue`
(un bug que lo tenía roto desde siempre, ver `gotchas.md` § 6).

### Los pasos

```
01  Datos básicos          tipo de inmueble + operación (solo clics)   ✅
02  Ubicación              cascada de niveles + calle + número         ✅
03  Detalles               precio, superficie, habitaciones, baños         ✅
04  Fotos                  hasta 10, en IndexedDB
05  Descripción y extras
────────────────────────────────────────────────────────────────────
    Publicar               identificarte (fuera del contador)
```

**Por qué identificarse no cuenta como paso.** Fotocasa lo numera como 5/5, así
que registrarse se siente como parte del formulario. Aquí el usuario llega a
"05/05" con el trabajo terminado y solo entonces se le pide la cuenta.

**Por qué el paso 1 no pide teclear nada.** Dos clics y ya has avanzado. Tanto
Fotocasa como Idealista te piden escribir un precio o una dirección en la
primera pantalla; empezar con algo trivial construye inercia.

---

## 2. Routing anidado: el concepto central

En Nuxt las rutas salen de la estructura de carpetas. Cuando tienes **un archivo
y una carpeta con el mismo nombre**:

```
pages/post-ad.vue            ← padre
pages/post-ad/basic-info.vue ← hijo
```

Nuxt no crea dos rutas independientes: crea una relación **padre/hijo**. El
padre envuelve al hijo y deja de comportarse como una página normal — por eso lo
llamamos "layout del flow".

Para que el hijo aparezca, el padre indica dónde va con `<NuxtPage />`. Si vienes
de React, es el `<Outlet />` de React Router.

**Por qué importa.** El indicador de pasos y los botones Atrás/Siguiente se
escriben **una sola vez** en el padre. Al navegar entre pasos el padre no se
vuelve a montar: solo cambia lo de dentro de `<NuxtPage />`, así que su estado
sobrevive.

### Por qué páginas y no un modal

El patrón que ya existía (`authStore.showAuthModal()` + `AuthModal.vue`) es
perfecto para un login, pero para un formulario de cinco pasos las páginas ganan:

- El botón "atrás" del navegador funciona gratis.
- Cada paso tiene URL propia, así que en analítica ves un embudo real.
- Puedes compartir o guardar la URL de un paso.

---

## 3. URLs traducidas (@nuxtjs/i18n)

Código en inglés, URLs en el idioma del usuario. Lo resuelve
`defineI18nRoute()`, declarado **dentro** del `<script setup>` de cada página:

```ts
defineI18nRoute({
  paths: {
    'es-CU': '/publicar-anuncio/datos-basicos',
    'es-DO': '/publicar-anuncio/datos-basicos',
    'en-CU': '/post-ad/basic-info',
    'en-DO': '/post-ad/basic-info'
  }
})
```

Esto es lo que Nuxt genera (verificado contra el router en ejecución):

```
post-ad-basic-info___es-CU  ->  /es-CU/publicar-anuncio/datos-basicos
post-ad-basic-info___en-CU  ->  /en-CU/post-ad/basic-info
post-ad-location___es-CU    ->  /es-CU/publicar-anuncio/ubicacion
post-ad___es-CU             ->  /es-CU/publicar-anuncio
```

Dos cosas a retener:

1. **El nombre de la ruta es estable entre idiomas**: siempre
   `post-ad-basic-info`, con el locale detrás tras un separador `___`. La URL
   cambia; el nombre, no. Esto es clave en `gotchas.md` § 4.
2. `defineI18nRoute` es un **macro de compilación**. Por eso no acepta variables
   ni puede ir dentro de un `if`.

### Nunca escribas rutas a mano

```vue
<!-- MAL: ignora el idioma, te lleva a un 404 -->
<BaseCta to="/post-ad/basic-info">

<!-- BIEN: resuelve la URL del idioma activo -->
<BaseCta is-link :to="localePath('post-ad-basic-info')">
```

Este era el bug del header: apuntaba a `to="/properties"` sin `is-link`, así que
hacía un `navigateTo()` crudo, sin prefijo de idioma, y a la página equivocada.

> `BaseCta` sin `is-link` renderiza un `<button>`; con `is-link`, un
> `<NuxtLink>`. Para navegar siempre quieres `is-link`: genera un `<a href>` de
> verdad, accesible y visible para los crawlers.

---

## 4. El layout minimalista

`layouts/flow.vue` deja el header con solo el logo y el footer con solo el
copyright y el selector de idioma. En un flow de conversión cada enlace es una
vía de escape.

Se activa desde el padre y lo heredan todos los pasos:

```ts
definePageMeta({ layout: 'flow' })
```

Funciona porque **Vue Router fusiona el `meta` de todas las rutas coincidentes**,
y el padre está siempre en `route.matched`.

Header y footer no se duplicaron: se les añadió una prop `minimal` que oculta el
`<nav>` y las columnas de enlaces. `footer__bottom` contiene el selector de
idioma que queremos conservar, y duplicarlo habría hecho que las dos copias se
separasen con el tiempo.

**No hay botón "Guardar"** a propósito, aunque Fotocasa lo tenga: ellos guardan
en su servidor, nosotros persistimos en `localStorage` en cada cambio.

---

## 5. El estado: el store de Pinia

```ts
export const useAdFlowStore = defineStore('adFlow', {
  state: () => ({ draft: emptyDraft() }),
  getters: { canGoNext: (state) => (step) => { /* reglas por paso */ } },
  actions: {
    update(patch) { Object.assign(this.draft, patch); this.persist() },
    persist() / hydrate() / reset()
  }
})
```

**Un `update(patch)` parcial en vez de un setter por campo.** El borrador
acabará con unos quince campos repartidos en cinco pasos.

**`canGoNext` es un getter que recibe el nombre del paso.** El layout pregunta
si puede avanzar sin saber qué campos tiene cada paso, y las reglas de los cinco
viven juntas en un `switch`.

### Por qué localStorage

El usuario rellena los cinco pasos **sin estar autenticado** y solo al final se
registra. Como cada paso es una navegación real, el estado en memoria se
perdería al recargar.

### La clave versionada

```ts
const STORAGE_KEY = 'ad-draft:v7'
```

Va por la v7 y cada subida vino de un cambio real. `hydrate()` mezcla lo
guardado con la forma nueva: sin versionar, un borrador antiguo metía claves
muertas dentro.

Ojo a un caso menos obvio: la v5 no cambió la _forma_ sino los **valores
válidos** (`BUY` pasó a `SALE`). Un borrador con `"BUY"` habría hidratado sin
corresponder a ninguna opción, dejando "Siguiente" habilitado con una operación
fantasma.

La v7 llegó al agrupar `location` + `street` + `streetNumber` en un único
`address`, y trajo un matiz: la mezcla de `hydrate()` es **superficial**, así que
un `address` guardado a medias dejaría `address.street` sin definir y
`canGoNext` reventaría al llamar a `.trim()`. Por eso esa rama se mezcla aparte:

```ts
this.draft = {
  ...empty,
  ...stored,
  address: { ...empty.address, ...stored.address }
}
```

### `computed` con getter y setter

```ts
const selectedType = computed({
  get: () => adFlowStore.draft.type ?? '',
  set: (value: string) => adFlowStore.update({ type: value as PropertyType })
})
```

Con un objeto `{ get, set }` el computed se vuelve escribible y sirve para
`v-model`. Así el store es la única fuente de verdad; con un `ref` local
tendrías dos copias que se desincronizan al navegar.

---

## 6. Las decisiones de diseño que más pesan

### Reutilizar los enums del buscador

Al principio creé `AdCategory` con la taxonomía de Fotocasa. Lo descartamos y
usamos `PropertyType` y `OperationType`, que ya existían.

El motivo es más fuerte que "no dupliques código": si publicar y buscar comparten
vocabulario, un inmueble publicado como `APARTMENT` + `RENT` es **directamente
filtrable** por "Apartamento" + "Alquilar". Con dos enums haría falta una tabla
de traducción, y ese tipo de tabla se desincroniza en silencio.

El precio: no hay "Local" ni "Trastero" en el paso 1. Decisión consciente.

### `SALE`, no `BUY` ni `SELL`

Comprar y vender no son dos operaciones: son la misma transacción vista desde
cada lado. El dato no debe tomar partido, así que el valor es el **nombre de la
transacción** — lo mismo que hacen Fotocasa e Idealista con "Transacción: Venta".

Las etiquetas sí dependen del contexto: quien publica ve "Vender", quien busca ve
"Comprar", y el dato guardado es el mismo.

---

## 7. Contexto del producto

`pages/index.vue` (buscador `HomeSearch` con Comprar/Alquilar/Compartir) es la
**referencia oficial**: un portal de clasificados. `pages/home2.vue` y sus
componentes —hero, destinos, pagos en crypto, comisión del 8%— son un
**prototipo tentativo** generado con IA, pendiente de evaluar. No condicionan las
decisiones de este flow.

De ahí que Alquiler signifique alquiler residencial y no vacacional, y que no
haya sub-pregunta de tipo de alquiler.

Queda por limpiar el residuo de aquel prototipo: `PropertyCategory` está definido
y no lo usa nadie, `IProperty` conserva `pricePerNight` y `maxGuests`, existe un
`booking.ts` completo, `CLAUDE.md` prohíbe `OperationType.Buy/Share` y
`HomeSearch.vue` sigue marcado `@deprecated`. Las dos últimas ya son falsas.

---

## 8. Validación: dos reglas a propósito

`CLAUDE.md` exige vee-validate en todos los formularios, pero en este flow la
navegación la decide `canGoNext`, un getter del store. Desde el paso 3 conviven,
y cada uno hace una cosa distinta:

- **yup** valida el **formato** de cada campo y produce un mensaje: "el precio
  tiene que ser mayor que cero". Vive en la página, va campo a campo, y su
  trabajo es que el usuario sepa qué está mal.
- **`canGoNext`** decide si el botón "Siguiente" se enciende. Vive en el store,
  mira el borrador y solo responde sí o no.

Se descartó unificarlos. Que mandase vee-validate obligaba al store a esperar a
que la página le dijera si era válida, y el store dejaba de poder contestar solo;
que el schema viviera en el store dejaba los mensajes de yup lejos de `t()`.

**El precio de convivir:** existe un instante en que el campo está en rojo y el
botón encendido, porque `canGoNext` solo comprueba que haya un número positivo.

**Lo que no cubre.** No hay `<form>` ni botón de submit: la navegación está en el
layout. Si el usuario **nunca toca** un campo obligatorio, no se dispara ninguna
validación y el botón se queda gris sin explicar por qué. Cerrarlo obliga a
habilitar "Siguiente" y validar al pulsarlo, que es tocar el layout de los cinco
pasos.

---

## 9. Las fotos no caben en localStorage

Una foto es un `File`, y `localStorage` solo guarda texto. `JSON.stringify` de un
fichero devuelve `{}`: no falla, no avisa, y la foto se pierde en silencio.
Pasarla a base64 la engorda un 33% y tres fotos de móvil ya revientan el límite
de ~5 MB con un `QuotaExceededError`.

Por eso los ficheros viven en **IndexedDB**, que guarda `Blob` tal cual y tiene
cuota de disco, no de 5 MB.

**Qué se movió y qué no.** Solo las fotos. El borrador sigue en `localStorage`
con su clave versionada y sus `persist`/`hydrate` síncronos, y guarda únicamente
los **ids**. Mover el borrador entero habría convertido `hydrate()` en asíncrono,
y de él cuelga el arranque del layout, que corre en el `setup` (`gotchas.md`).

**La factura de esa decisión:** son dos almacenes que se pueden desincronizar.
Un id sin fichero —otro navegador, o datos del sitio borrados— se descarta al
cargar el paso, en `useAdPhotos.load()`. Y `reset()` tiene que vaciar los dos, o
las fotos quedan huérfanas ocupando disco.

**Por qué se reescala antes de guardar.** Una foto de móvil ronda los 4 MB; diez
llenarían el disco del usuario para nada, y habría que reescalarlas igual el día
que exista la subida. `useImageResize.ts` las deja en 1600px de lado largo y JPEG
al 82%, unos 300 KB. Dos efectos secundarios: se pierde la transparencia de los
PNG, y sin `imageOrientation: 'from-image'` las fotos verticales de móvil salen
tumbadas, porque la rotación está en los metadatos EXIF y el canvas no los mira.

**Y un tercero que interesa conservar:** repintar en un canvas **borra el EXIF
entero**, y con él las **coordenadas GPS** que el móvil mete en cada foto.
Publicar la posición exacta de una vivienda dentro de la imagen es una fuga de
privacidad de manual, y aquí se evita de rebote. Si algún día alguien decide
guardar el fichero original "para no perder calidad", esto es lo que se pierde.
