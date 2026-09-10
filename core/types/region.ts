export enum LevelType {
  Level1 = 1,
  Level2 = 2,
  Level3 = 3
}

// Una región es un nodo del árbol administrativo: provincia, municipio o
// localidad. Nunca lleva calle ni coordenadas; eso vive en IAdAddress.
export interface IRegion {
  id?: string
  highlighted_text?: string
  term?: string
  country_code?: string
  level1?: string
  level2?: string
  level3?: string
  level_type: LevelType
}

// Un nodo suelto de la jerarquía: solo el nombre, que es lo que se pinta y lo
// que identifica al hijo en la siguiente petición.
export interface IRegionNode {
  name: string
}

export interface IRegionModule {
  suggest(
    query: string,
    countryCode: string,
    levelType?: LevelType
  ): Promise<IRegion[]>
  children(countryCode: string, parents?: string[]): Promise<IRegionNode[]>
}
