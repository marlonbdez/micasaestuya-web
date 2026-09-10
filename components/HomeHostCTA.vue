<script setup lang="ts"></script>

<template>
  <div class="section-full">
    <div class="host-cta">
      <h2>{{ $t('home.host_cta.title') }}</h2>
      <p>{{ $t('home.host_cta.subtitle') }}</p>
      <button type="button" class="btn-primary">
        {{ $t('home.host_cta.button') }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.section-full {
  padding: 6.25rem $section-padding-x;
  background: var(--bg);
}

.host-cta {
  text-align: center;
  max-width: 37.5rem;
  margin: 0 auto;
}

.host-cta h2 {
  font-size: clamp(1.75rem, 3.5vw, 2.75rem);
  font-weight: 600;
  color: var(--text);
  letter-spacing: -0.0625rem;
  line-height: 1.1;
  margin: 0 0 $gap-medium;
}

.host-cta p {
  font-size: 1rem;
  font-weight: 300;
  color: var(--text-3);
  line-height: 1.65;
  margin: 0 0 $gap-large;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: $gap-small;
  background: var(--red-orange-600);
  color: white;
  padding: 0.9375rem $gap-large;
  border-radius: $corner-radius-pill;
  font-family: var(--font);
  font-size: $font-size-base;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);

  :root.dark-mode & {
    background: var(--red-orange-400);
    color: var(--red-orange-950);
  }

  &:hover {
    opacity: 0.85;
    transform: scale(0.98);
  }
}

@include media-breakpoint-down(md) {
  .section-full {
    padding: $section-padding-y-sm $section-padding-x-sm;
  }
}
</style>
