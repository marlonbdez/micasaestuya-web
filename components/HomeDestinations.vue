<script setup lang="ts">
import { ref } from 'vue'

const destinations = [
  { flag: '🇨🇺', name: 'Cuba', count: '380 casas', active: true },
  { flag: '🇩🇴', name: 'R. Dominicana', count: '210 casas' },
  { flag: '🇵🇷', name: 'Puerto Rico', count: '145 casas' },
  { flag: '🇲🇽', name: 'Tulum · Bacalar', count: '198 casas' },
  { flag: '🇨🇴', name: 'Cartagena', count: '122 casas' },
  { flag: '🇯🇲', name: 'Jamaica', count: '88 casas' },
  { flag: '🇻🇨', name: 'San Vicente', count: '34 casas' },
  { flag: '🇧🇧', name: 'Barbados', count: '27 casas' }
]

const activeDestination = ref<string>('Cuba')

const selectDestination = (name: string) => {
  activeDestination.value = name
}
</script>

<template>
  <div class="section-full">
    <div class="section-inner">
      <div class="section-header">
        <div>
          <div class="section-label">
            {{ $t('home.destinations.subtitle') }}
          </div>
          <h2 class="section-title">{{ $t('home.destinations.title') }}</h2>
        </div>
        <a href="#" class="link-more">Ver todos →</a>
      </div>
      <div class="destinations-strip">
        <button
          v-for="dest in destinations"
          :key="dest.name"
          type="button"
          class="dest-item"
          :class="{ active: activeDestination === dest.name }"
          @click="selectDestination(dest.name)"
        >
          <div class="dest-flag">{{ dest.flag }}</div>
          <div class="dest-name">{{ dest.name }}</div>
          <div class="dest-count">{{ dest.count }}</div>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.section-full {
  padding: $section-padding-y $section-padding-x;
  background: var(--bg-2);
}

.section-inner {
  max-width: $max-width-content;
  margin: 0 auto;
}

.section-label {
  font-size: $font-size-2xs;
  font-weight: 600;
  letter-spacing: 0.094rem;
  text-transform: uppercase;
  color: var(--text-3);
  margin-bottom: $gap-small;
}

.section-title {
  font-size: clamp(1.625rem, 3vw, 2.375rem);
  font-weight: 600;
  color: var(--text);
  letter-spacing: -0.05rem;
  line-height: 1.15;
  margin: 0 0 $gap-small;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: $gap-large;
  gap: $gap-medium;
  flex-wrap: wrap;
}

.link-more {
  font-size: $font-size-sm;
  font-weight: 500;
  color: var(--text-3);
  text-decoration: none;
  transition: color 0.22s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;

  &:hover {
    color: var(--text);
  }
}

.destinations-strip {
  display: flex;
  gap: $gap-extra-small;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  padding-bottom: $gap-extra-tiny;

  &::-webkit-scrollbar {
    display: none;
  }
}

.dest-item {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.625rem;
  cursor: pointer;
  transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
  padding: $gap-medium 1.25rem;
  border-radius: $corner-radius-large;
  border: 0.125rem solid transparent;
  min-width: 6.25rem;
  text-align: center;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font);
  font-size: inherit;

  :root.dark-mode & {
    background: var(--zinc-900);
  }

  &:hover,
  &.active {
    background: var(--zinc-200);
    border-color: var(--text);

    :root.dark-mode & {
      background: var(--zinc-700);
    }
  }
}

.dest-flag {
  font-size: 2rem;
  line-height: 1;
}

.dest-name {
  font-size: $font-size-xs;
  font-weight: 500;
  color: var(--text);
}

.dest-count {
  font-size: $font-size-2xs;
  color: var(--text-3);
  margin-top: -$gap-extra-tiny;
}

@include media-breakpoint-down(md) {
  .section-full {
    padding: $section-padding-y-sm $section-padding-x-sm;
  }
}
</style>
