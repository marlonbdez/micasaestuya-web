# Regiones, direcciones y locales

Cómo se nombra y se modela **dónde está un inmueble**. Es la parte del proyecto
donde más fácil es liarla, porque hubo un tiempo en que dos palabras
significaban lo mismo y ninguna significaba una tercera cosa.

## 1. Las tres palabras, y por qué son tres

Es la convención más importante del proyecto en esta zona, porque durante un
tiempo tuvimos dos palabras para lo mismo y ninguna para una tercera cosa.

| palabra   | qué es                                 | dónde vive                                                    |
| --------- | -------------------------------------- | ------------------------------------------------------------- |
| `locale`  | país + idioma (`es-CU`, `en-DO`)       | `Locales.ts`, `localeUtils.ts`, `LocaleModal.vue`             |
| `region`  | un nodo del árbol administrativo       | `regions_*.json`, claves de Redis, `/api/regions`, la cascada |
| `address` | la región **más** la calle y el número | `IAdAddress` en el borrador, `pages/post-ad/address.vue`      |

Viene de schema.org, que es el vocabulario que Google lee: `PostalAddress`
tiene `addressRegion` para la división administrativa y `streetAddress` para la
calle, ambas dentro de la dirección. Cuando toque emitir el JSON-LD de la
ficha, el modelo interno ya habla ese idioma y es copiar campos.

**La regla que no hay que romper:** una región nunca lleva calle ni
coordenadas. Si algún día hay coordenadas, van en `address`, al lado de
`region`, nunca dentro. La estructura anidada de `IAdAddress` lo hace difícil
de romper por accidente, que es mejor que confiar en que alguien recuerde esto.

Ojo con un falso amigo: en `Locales.ts` el campo se llama `country`, no
`region`, precisamente para que "region" signifique una sola cosa. Y el texto
que ve el usuario en `LocaleModal` sí dice "Región" — eso es copy, no código, y
no se cruza con nada porque está en otra pantalla.

**Única excepción viva:** las claves de Redis siguen siendo `regions-index:`,
`regions-data`, etc. Eso ya era correcto antes del renombrado, y por eso el
cambio no obligó a resembrar nada, ni en local ni en staging.

---

## 2. Dos componentes distintos, y por qué

La home usa **autocompletado** (`RegionSuggest`) y el paso 2 usa
**desplegables encadenados** (`RegionCascade`). No es incoherencia: quien busca
sabe a dónde quiere ir y escribe; quien publica puede no saber el nombre oficial
de su localidad. Es la diferencia entre _recordar_ y _reconocer_.

Los datos respaldan la decisión: Cuba tiene 16 provincias y 168 municipios;
República Dominicana, 32 y 158. Perfecto para desplegables. Pero las localidades
llegan a 386 en un solo municipio dominicano, y **hay municipios sin ninguna**.
Por eso el tercer nivel solo aparece si existe, y el municipio vale como
región por sí sola.

### La cascada es un array, no tres variables

```ts
const selected = ref<string[]>([]) // ['Matanzas', 'Cárdenas', 'Varadero']
const options = ref<IRegionNode[][]>([]) // [[provincias], [municipios], [localidades]]

const select = async (index: number, value: string) => {
  selected.value = [...selected.value.slice(0, index), value].filter(Boolean)
  options.value = options.value.slice(0, index + 1)
  const children = await fetchChildren(selected.value)
  if (children.length) options.value.push(children)
  return toRegion()
}
```

El truncado con `slice` es la clave: elegir en el nivel _i_ invalida todo lo que
cuelga de él. Si tienes Matanzas → Cárdenas y cambias a Holguín, "Cárdenas" deja
de ser válido porque no es un municipio de Holguín.

`options.length` es a la vez cuántos desplegables pintar, y `selected.length` es
directamente el `level_type`: si el municipio no tiene localidades, hay dos
niveles y `level_type` vale 2. No se decide en ningún sitio, se deduce.

La primera versión tenía `level1`, `level2`, `level3` y sus tres `Options`, con
tres funciones casi idénticas. Cuando aparecen sufijos numerados en los nombres,
lo que hay debajo es un array.

`restore()` existe porque para que un desplegable **muestre** lo elegido, antes
tiene que **contenerlo** entre sus opciones. Al volver al paso 2, baja la cadena
pidiendo cada lista.

### El endpoint `/regions/children`

Sirve la jerarquía leyendo `data/regions_*.json`, no Redis: el índice de Redis
está construido por prefijo para el autocompletado y no sabe responder "dame los
hijos de X". Son datos estáticos, así que en memoria basta, y además evita tener
que resembrar.

Acepta la cadena completa (`level1`, `level2`, `level3`) y devuelve lista vacía
al llegar al fondo. Eso importa: ver 8.7.

---

## 3. El filtro por nivel en el autocompletado

El paso 2 no lo usa, pero el endpoint quedó preparado y la home podría
aprovecharlo.

`suggest` devolvía los diez primeros resultados sin poder filtrar, y buscar
"Haba" daba una provincia y nueve municipios: cero localidades. La clave estaba
en el sembrado (`redisSeed.js`): cada entrada se indexa con
`zadd(clave, prioridad, id)` donde la prioridad es **1 para provincias, 2 para
municipios y 3 para localidades**. La puntuación de Redis ya _es_ el nivel, y
`zrange(clave, 0, 9)` ordena por puntuación, así que las localidades nunca
entraban en el corte.

```js
const readIds = (key) =>
  levelType
    ? redisClient.zrangebyscore(
        key,
        levelType,
        levelType,
        'LIMIT',
        0,
        RESULT_LIMIT
      )
    : redisClient.zrange(key, 0, RESULT_LIMIT - 1)
```

Con dos detalles que no son opcionales:

**`AGGREGATE MIN` en el `zinterstore`.** Las búsquedas de varias palabras cruzan
una lista por prefijo, y Redis **suma** las puntuaciones por defecto: "La Habana"
convertiría una localidad de nivel 3 en un 6. `MIN` conserva la puntuación y no
altera el orden.

**El filtro se aplica al leer, no al guardar.** Por eso la clave de caché no
lleva el nivel: la caché almacena el cruce completo y cada petición se queda con
lo suyo. De paso arregla una incoherencia previa, en la que la primera llamada
devolvía diez y las cacheadas devolvían el cruce entero.

---
