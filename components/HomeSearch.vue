<script setup lang="ts">
import { useRegionStore } from '@/stores/region'
import { OperationType, PropertyType } from '@/core/types'
const { t } = useI18n()
const regionStore = useRegionStore()

const operationType = ref<string>(OperationType.Sale)
const propertyType = ref<string>(PropertyType.Apartment)
const propertyTypes = computed(() => [
  {
    id: PropertyType.Apartment,
    value: t('property_types.apartment')
  },
  {
    id: PropertyType.House,
    value: t('property_types.house')
  },
  {
    id: PropertyType.Office,
    value: t('property_types.office')
  },
  {
    id: PropertyType.Garage,
    value: t('property_types.garage')
  },
  {
    id: PropertyType.Landscape,
    value: t('property_types.landscape')
  }
])
</script>

<template>
  <div class="home-search container">
    <div class="home-search__image"></div>
    <div class="home-search__content">
      <h1 class="home-search__title">
        {{ $t('home.title') }}
      </h1>
      <form class="home-search__form" @submit.prevent="regionStore.doSearch()">
        <div class="radios-wrapper">
          <BaseRadioButton
            id="radio-sale"
            v-model:selected="operationType"
            name="operation-type"
            :value="OperationType.Sale"
            button
            inline
          >
            {{ $t('search.operation_type.sale') }}
          </BaseRadioButton>
          <BaseRadioButton
            id="radio-rent"
            v-model:selected="operationType"
            name="operation-type"
            :value="OperationType.Rent"
            button
            inline
          >
            {{ $t('search.operation_type.rent') }}
          </BaseRadioButton>
          <BaseRadioButton
            id="radio-share"
            v-model:selected="operationType"
            name="operation-type"
            :value="OperationType.Share"
            button
            inline
          >
            {{ $t('search.operation_type.share') }}
          </BaseRadioButton>
        </div>
        <BaseSelect
          id="property-type-options"
          v-model="propertyType"
          :options="propertyTypes"
          :label="$t('search.property_type')"
          hide-label
          class="property-type-options"
        />
        <HomeSearchSuggest class="search-options" />
        <BaseCta class="search-cta">
          {{ $t('search.button') }}
        </BaseCta>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
html.dark-mode .home-search__image {
  @include media-breakpoint-up(sm) {
    background-image: url('~/assets/images/home_search_night.webp');
  }
}

.home-search {
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: 26.25rem;
  gap: $gap-medium;

  @include media-breakpoint-up(sm) {
    gap: $gap-extra-medium;
    margin-top: $gap-huge;
    margin-bottom: $gap-huge;
    padding-top: $gap-large;
    padding-bottom: $gap-large;
    max-width: none;
  }

  &__image {
    @include media-breakpoint-up(sm) {
      position: absolute;
      top: 0;
      right: $gap-medium;
      width: 75%;
      height: 100%;
      border-radius: $corner-radius-medium;
      background-image: url('~/assets/images/home_search_day.webp');
      background-size: cover;
      background-repeat: no-repeat;
      background-position: left center;
      transition: background-image 0.3s ease-in-out;
    }
  }

  &__content {
    position: relative;

    @include media-breakpoint-up(sm) {
      max-width: 26.25rem;
      padding: $gap-large;
      @include rounded-corner;
    }
  }

  &__title {
    @include font-roboto-bold;
    font-size: 1.75rem;
    line-height: 2.25rem;
    text-align: center;
    margin: 0;
  }
}

.home-search__form {
  position: relative;
  display: flex;
  flex-direction: column;
  padding-top: $gap-extra-medium;
  padding-bottom: $gap-small;
}

.radios-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  margin-bottom: $gap-large;
}

.property-type-options {
  margin-bottom: $gap-large;
}

.search-options {
  margin-bottom: $gap-large;

  :deep(.dropdown__content) {
    width: 100%;
  }
}
.search-cta {
  @include media-breakpoint-up(lg) {
    flex-grow: 1;
  }
}
</style>
