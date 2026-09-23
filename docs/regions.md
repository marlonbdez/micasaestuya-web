# Regiones — implementación en el frontend

Cómo se implementa en `web` la elección de región: autocompletado en la home,
desplegables encadenados en el flow de publicar.

> El vocabulario compartido (`locale` / `region` / `address`) vive en
> `micasaestuya-docs/Domain-Vocabulary.md` — esto es solo la implementación en
> `web`. La parte de `api` (índice de Redis, filtro por nivel) está en
> `micasaestuya-api/docs/gotchas.md`.

## Dos componentes distintos, y por qué

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
que resembrar. Detalle de la implementación en `micasaestuya-api/docs/gotchas.md`.

Acepta la cadena completa (`level1`, `level2`, `level3`) y devuelve lista vacía
al llegar al fondo.
