<script setup lang="ts">
import { useVacationalSearch } from '~/composables/useVacationalSearch'

const {
  searchParams,
  popularDestinations,
  guestOptions,
  selectDestination,
  handleSearch
} = useVacationalSearch()

// ---------------------------------------------------------------------------
// Adapters — BaseInput/BaseSelect trabajan con strings; ISearchParams usa
// string | null para fechas y number para guests.
// ---------------------------------------------------------------------------

const checkIn = computed({
  get: () => searchParams.value.checkIn ?? '',
  set: (val: string) => {
    searchParams.value.checkIn = val || null
  }
})

const checkOut = computed({
  get: () => searchParams.value.checkOut ?? '',
  set: (val: string) => {
    searchParams.value.checkOut = val || null
  }
})

const guestSelectOptions = computed(() =>
  guestOptions.value.map((o) => ({ id: String(o.value), value: o.label }))
)

const selectedGuests = computed({
  get: () => String(searchParams.value.guests),
  set: (val: string) => {
    searchParams.value.guests = Number(val)
  }
})
</script>

<template>
  <div class="home-search">
    <!--
      PENDIENTE Sprint 3 — mejoras en componentes base para pill layout

      BaseInput → añadir prop `hide-wrapper` (boolean):
        Cuando true, renderiza solo <label> + <input> sin el div .form-group.
        Permite eliminar el override :deep(.form-group) { display: contents }
        de este componente.

      BaseCta → añadir variant="accent-pill":
        - background: var(--accent) / color: var(--accent-inv)
        - border-radius: var(--radius-pill)
        - Sin clases .btn / .primary (elimina conflicto de especificidad CSS 0,2,1)
        - Prop `type` forwarded al elemento raíz (necesario para type="submit")
        Hasta entonces: <button> raw con clase .home-search__submit.
    -->
    <form class="home-search__form" @submit.prevent="handleSearch">
      <!-- Destination -->
      <div class="home-search__field">
        <BaseInput
          id="search-destination"
          v-model="searchParams.destination"
          :label="$t('search.destination.label')"
          :placeholder="$t('search.destination.placeholder')"
        />
      </div>

      <!-- Check-in -->
      <div class="home-search__field">
        <BaseInput
          id="search-checkin"
          v-model="checkIn"
          type="date"
          :label="$t('search.check_in.label')"
        />
      </div>

      <!-- Check-out -->
      <div class="home-search__field">
        <BaseInput
          id="search-checkout"
          v-model="checkOut"
          type="date"
          :label="$t('search.check_out.label')"
        />
      </div>

      <!-- Guests -->
      <div class="home-search__field home-search__field--guests">
        <BaseSelect
          id="search-guests"
          v-model="selectedGuests"
          :options="guestSelectOptions"
          :label="$t('search.guests.label')"
        />
      </div>

      <!-- Search button — raw <button> hasta Sprint 3 (BaseCta variant="accent-pill") -->
      <button
        type="submit"
        class="home-search__submit"
        :aria-label="$t('search.button')"
      >
        <BaseIcon
          icon="search"
          :aria-hidden="true"
          class="home-search__submit-icon"
        />
        {{ $t('search.button') }}
      </button>
    </form>

    <!-- Popular destinations chips -->
    <div class="home-search__chips">
      <span class="home-search__chips-label">{{ $t('search.popular') }}:</span>
      <button
        v-for="dest in popularDestinations"
        :key="dest.name"
        type="button"
        class="home-search__chip"
        :title="`${dest.flag} ${dest.name}, ${dest.country}`"
        @click="selectDestination(dest.name)"
      >
        {{ dest.flag }} {{ dest.name }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-search {
  width: 100%;
  max-width: px-to-rem(780);
  margin: 0 auto;

  // -------------------------------------------------------------------------
  // Formulario
  // -------------------------------------------------------------------------

  &__form {
    display: flex;
    align-items: stretch;
    background: var(--search-bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-pill);
    box-shadow: var(--card-shadow);
    overflow: hidden;
    transition: box-shadow var(--transition);

    &:focus-within {
      box-shadow: var(--card-shadow-hover);
      border-color: var(--text-3);
    }
  }

  // -------------------------------------------------------------------------
  // Campo individual
  // -------------------------------------------------------------------------

  &__field {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: px-to-rem(14) px-to-rem(24);
    border-right: 1px solid var(--border);
    cursor: pointer;
    transition: background var(--transition);
    min-width: 0;

    &:hover {
      background: var(--bg-2);
    }

    &:last-of-type {
      border-right: none;
    }

    &--guests {
      max-width: px-to-rem(140);
      flex-shrink: 0;
    }

    // Neutraliza el wrapper .form-group de BaseInput / BaseSelect para que el
    // label + input sean hijos directos del flex-column del campo.
    // Sprint 3: eliminar cuando BaseInput añada prop hide-wrapper.
    :deep(.form-group) {
      display: contents;
    }

    :deep(.form-group__label) {
      @include label;
      color: var(--text);
      margin-bottom: px-to-rem(3);
      cursor: pointer;
    }

    :deep(.form-group__input) {
      border: none;
      background: transparent;
      outline: none;
      height: auto;
      font-family: var(--font);
      font-size: px-to-rem(14);
      font-weight: 400;
      color: var(--text-2);
      width: 100%;
      cursor: pointer;
      letter-spacing: normal;

      &::placeholder {
        color: var(--text-3);
      }

      &::-webkit-calendar-picker-indicator {
        cursor: pointer;
        color: var(--text-2);
      }
    }

    // BaseSelect: preservar background-image del chevron, solo resetear border/color
    :deep(.form-group__select) {
      border: none;
      background-color: transparent;
      outline: none;
      height: auto;
      font-family: var(--font);
      font-size: px-to-rem(14);
      font-weight: 400;
      color: var(--text-2);
      width: 100%;
      cursor: pointer;
      letter-spacing: normal;
    }
  }

  // -------------------------------------------------------------------------
  // Botón buscar — raw hasta Sprint 3 (BaseCta variant="accent-pill")
  // -------------------------------------------------------------------------

  &__submit {
    flex-shrink: 0;
    margin: px-to-rem(6);
    background: var(--accent);
    color: var(--accent-inv);
    border: none;
    border-radius: var(--radius-pill);
    padding: 0 px-to-rem(28);
    font-family: var(--font);
    font-size: px-to-rem(14);
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: px-to-rem(8);
    transition: all var(--transition);
    white-space: nowrap;

    &:hover {
      opacity: 0.85;
      transform: scale(0.98);
    }

    &:active {
      transform: scale(0.96);
    }

    &:focus-visible {
      outline: px-to-rem(2) solid var(--accent);
      outline-offset: px-to-rem(2);
    }
  }

  &__submit-icon {
    flex-shrink: 0;

    :deep(svg) {
      width: px-to-rem(15);
      height: px-to-rem(15);
      stroke: currentColor;
      fill: none;
    }
  }

  // -------------------------------------------------------------------------
  // Chips de destinos populares
  // -------------------------------------------------------------------------

  &__chips {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: px-to-rem(8);
    margin-top: px-to-rem(18);
    flex-wrap: wrap;
  }

  &__chips-label {
    @include caption;
    font-weight: 400;
    margin-right: px-to-rem(4);
  }

  &__chip {
    @include font-outfit-medium;
    background: var(--bg-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-pill);
    padding: px-to-rem(6) px-to-rem(14);
    font-size: px-to-rem(12);
    color: var(--text);
    cursor: pointer;
    transition: all var(--transition);
    white-space: nowrap;

    &:hover {
      background: var(--bg-3);
      border-color: var(--text-3);
    }

    &:active {
      transform: scale(0.96);
    }
  }

  // -------------------------------------------------------------------------
  // Responsive — mobile (xs: 40rem / 640px)
  // -------------------------------------------------------------------------

  @include media-breakpoint-down(xs) {
    &__field {
      padding: px-to-rem(12) px-to-rem(16);

      &--guests {
        max-width: px-to-rem(120);
      }

      :deep(.form-group__label) {
        font-size: px-to-rem(9);
      }

      :deep(.form-group__input),
      :deep(.form-group__select) {
        font-size: px-to-rem(13);
      }
    }

    &__submit {
      padding: 0 px-to-rem(20);
      font-size: px-to-rem(13);
      gap: px-to-rem(6);
    }

    &__submit-icon :deep(svg) {
      width: px-to-rem(13);
      height: px-to-rem(13);
    }

    &__chips-label {
      display: none;
    }
  }
}
</style>
