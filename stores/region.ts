import { defineStore } from 'pinia'
import type { IRegion } from '~/core/types/region'

export const useRegionStore = defineStore('region', {
  state: () => ({
    selectedRegion: {} as IRegion
  }),

  actions: {
    doSearch() {
      console.log('Searching homes in region', this.selectedRegion)
    },
    selectRegion(region: IRegion) {
      this.selectedRegion = region
    }
  }
})
