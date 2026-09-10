<script setup lang="ts">
import type { IRegion } from '~/core/types/region'
import { useRegionStore } from '~/stores/region'

const { t } = useI18n()
const regionStore = useRegionStore()

const suggest = ref<{ select: (optionId?: string) => void } | null>(null)
const showError = ref(false)

const onSelect = (region: IRegion): void => {
  showError.value = false
  regionStore.selectRegion(region)
  navigateTo('/properties')
}

regionStore.$onAction(({ name }) => {
  if (name === 'doSearch') suggest.value?.select()
})
</script>

<template>
  <RegionSuggest
    id="search"
    ref="suggest"
    hide-label
    lock-on-select
    :label="t('search.placeholder')"
    :placeholder="t('search.placeholder')"
    :error-message="showError ? t('search.error') : ''"
    class="home-search-suggest"
    @select="onSelect"
    @select-empty="showError = true"
  />
</template>

<style lang="scss" scoped>
.home-search-suggest {
  :deep(input) {
    padding-left: 2.5rem;
    background-image: url('~/assets/icons/search.svg');
    background-repeat: no-repeat;
    background-size: 1.5rem;
    background-position-y: 0.625rem;
    background-position-x: 0.625rem;
  }
}
</style>
