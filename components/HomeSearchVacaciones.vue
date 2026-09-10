<script setup lang="ts">
import { useVacationSearch } from '@/composables/useVacationSearch'

const {
  params,
  guestOptions,
  popularDestinations,
  selectedGuestId,
  selectedGuestLabel,
  selectDestination,
  onGuestSelect,
  submit
} = useVacationSearch()
</script>

<template>
  <div class="vacation-search">
    <!-- Pill de búsqueda -->
    <form class="vacation-search__box" @submit.prevent="submit">
      <!-- Destino -->
      <div class="vacation-search__field">
        <span class="vacation-search__label">
          {{ $t('search.vacation.destination.label') }}
        </span>
        <BaseInput
          id="vacation-destination"
          v-model="params.destination"
          :label="$t('search.vacation.destination.label')"
          :placeholder="$t('search.vacation.destination.placeholder')"
          hide-label
          class="vacation-search__base-input"
        />
      </div>

      <!-- Llegada -->
      <div class="vacation-search__field">
        <span class="vacation-search__label">
          {{ $t('search.vacation.check_in.label') }}
        </span>
        <BaseInput
          id="vacation-checkin"
          v-model="params.checkIn"
          type="date"
          :label="$t('search.vacation.check_in.label')"
          hide-label
          class="vacation-search__base-input"
        />
      </div>

      <!-- Salida -->
      <div class="vacation-search__field">
        <span class="vacation-search__label">
          {{ $t('search.vacation.check_out.label') }}
        </span>
        <BaseInput
          id="vacation-checkout"
          v-model="params.checkOut"
          type="date"
          :label="$t('search.vacation.check_out.label')"
          hide-label
          class="vacation-search__base-input"
        />
      </div>

      <!-- Huéspedes -->
      <div class="vacation-search__field vacation-search__field--guests">
        <span class="vacation-search__label">
          {{ $t('search.vacation.guests.label') }}
        </span>
        <BaseDropdown
          id="vacation-guests"
          :options="guestOptions"
          :selected="selectedGuestId"
          :label="$t('search.vacation.guests.label')"
          class="vacation-search__guests-dropdown"
          @update:selected="onGuestSelect"
        >
          <!-- Trigger personalizado — muestra el valor seleccionado sin borde -->
          <template #selector>
            <div class="vacation-search__guests-trigger">
              {{ selectedGuestLabel }}
              <BaseIcon
                icon="chevron-down"
                size="xs"
                class="vacation-search__guests-icon"
              />
            </div>
          </template>
        </BaseDropdown>
      </div>

      <!-- Botón buscar -->
      <div class="vacation-search__action">
        <BaseCta
          variant="primary"
          class="vacation-search__btn"
          :aria-label="$t('search.vacation.button')"
        >
          <BaseIcon icon="search" size="sm" />
          {{ $t('search.vacation.button') }}
        </BaseCta>
      </div>
    </form>

    <!-- Chips de destinos populares -->
    <div class="vacation-search__chips">
      <span class="vacation-search__chips-label">
        {{ $t('search.vacation.popular') }}:
      </span>
      <BaseCta
        v-for="dest in popularDestinations"
        :key="dest.slug"
        variant="ghost"
        class="vacation-search__chip"
        @click="selectDestination(dest.name)"
      >
        {{ dest.flag }} {{ dest.name }}
      </BaseCta>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// Mixins and variables are globally injected via nuxt.config.ts
// (additionalData: tokens + abstract/_mixins.scss) — no @use needed here.

.vacation-search {
  width: 100%;
  max-width: 48.75rem; // 780px

  // ── Pill container ────────────────────────────────────────────────────────
  &__box {
    display: flex;
    align-items: stretch;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-pill);
    box-shadow: var(--card-shadow);
    overflow: visible;
    transition: box-shadow 0.22s cubic-bezier(0.4, 0, 0.2, 1);

    &:focus-within {
      box-shadow: var(--card-shadow-hover);
      border-color: var(--text-3);
    }
  }

  // ── Cada campo dentro del pill ────────────────────────────────────────────
  &__field {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: $gap-small $gap-medium;
    border-right: 1px solid var(--border);
    cursor: pointer;
    transition: background 0.22s cubic-bezier(0.4, 0, 0.2, 1);
    min-width: 0;
    position: relative;

    &:hover {
      background: var(--bg-2);
    }

    &--guests {
      max-width: 8.75rem; // 140px
      flex-shrink: 0;
      border-right: none;
    }
  }

  // Label pequeño sobre el input
  &__label {
    font-size: 0.656rem; // ~10.5px
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--text);
    margin-bottom: 0.2rem;
    white-space: nowrap;
  }

  // Override de BaseInput para ajustarse al pill (sin borde ni fondo propio)
  &__base-input {
    :deep(.form-group__input) {
      border: none;
      background: transparent;
      outline: none;
      padding: 0;
      height: auto;
      font-family: var(--font);
      font-size: 0.875rem;
      color: var(--text-2);
      letter-spacing: 0;

      &:focus {
        box-shadow: none;
        border-color: transparent;
      }

      &::placeholder {
        color: var(--text-3);
      }

      &::-webkit-calendar-picker-indicator {
        cursor: pointer;
        opacity: 0.5;
      }
    }

    :deep(.form-group) {
      margin: 0;
    }
  }

  // ── Dropdown de huéspedes ─────────────────────────────────────────────────
  &__guests-dropdown {
    :deep(.dropdown__content) {
      right: auto;
      left: 0;
      min-width: 10rem;
    }
  }

  &__guests-trigger {
    display: flex;
    align-items: center;
    gap: $gap-extra-tiny;
    font-size: 0.875rem;
    color: var(--text-2);
    cursor: pointer;
    font-family: var(--font);
  }

  &__guests-icon {
    color: var(--text-3);
    flex-shrink: 0;
  }

  // ── Botón de búsqueda ─────────────────────────────────────────────────────
  &__action {
    display: flex;
    align-items: center;
    padding: $gap-extra-tiny;
    flex-shrink: 0;
  }

  &__btn {
    white-space: nowrap;

    :deep(.btn) {
      border-radius: var(--radius-pill);
      padding: 0 $gap-medium;
      gap: $gap-extra-tiny;
      font-family: var(--font);
      font-size: 0.875rem;
    }
  }

  // ── Chips de destinos populares ───────────────────────────────────────────
  &__chips {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $gap-extra-tiny;
    margin-top: $gap-medium;
    flex-wrap: wrap;
  }

  &__chips-label {
    font-size: 0.75rem;
    color: var(--text-3);
    font-weight: 400;
    margin-right: $gap-extra-tiny;
  }

  &__chip {
    :deep(.btn) {
      border-radius: var(--radius-pill);
      min-height: unset;
      padding: $gap-extra-tiny $gap-small;
      font-size: 0.781rem;
      font-family: var(--font);
    }
  }

  // ── Responsive ────────────────────────────────────────────────────────────
  @include media-breakpoint-down(md) {
    &__box {
      flex-wrap: wrap;
      border-radius: var(--radius);
      overflow: hidden;
    }

    &__field {
      flex: 1 1 40%;
      border-right: none;
      border-bottom: 1px solid var(--border);

      &--guests {
        max-width: none;
        border-bottom: none;
      }
    }

    &__action {
      width: 100%;
      padding: $gap-small $gap-medium;
      border-top: 1px solid var(--border);
    }

    &__btn {
      width: 100%;

      :deep(.btn) {
        width: 100%;
        justify-content: center;
      }
    }
  }

  @include media-breakpoint-down(sm) {
    &__chips-label {
      display: none;
    }

    &__field {
      flex: 1 1 100%;
    }
  }
}
</style>
