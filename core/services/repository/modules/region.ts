import FetchFactory from '../fetchFactory'
import type {
  IRegionModule,
  IRegion,
  IRegionNode,
  LevelType
} from '~/core/types/region'

class RegionModule extends FetchFactory implements IRegionModule {
  private resource = 'regions'

  async suggest(
    query: string,
    countryCode: string,
    levelType?: LevelType
  ): Promise<any> {
    // URLSearchParams en vez de interpolar: un término con & o # rompería
    // la query si se concatenara a mano.
    const params = new URLSearchParams({
      term: query,
      country_code: countryCode
    })
    if (levelType) params.set('level_type', String(levelType))

    return await this.call<IRegion>(
      'GET',
      `${this.resource}/suggest?${params.toString()}`
    )
  }

  // `parents` es la cadena completa: sin nada devuelve el primer nivel, con
  // un padre el segundo, y así. Si se pasa la cadena entera hasta el último
  // nivel, devuelve una lista vacía.
  async children(countryCode: string, parents: string[] = []): Promise<any> {
    const params = new URLSearchParams({ country_code: countryCode })
    parents.forEach((parent, index) => params.set(`level${index + 1}`, parent))

    return await this.call<IRegionNode[]>(
      'GET',
      `${this.resource}/children?${params.toString()}`
    )
  }
}

export default RegionModule
