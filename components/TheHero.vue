<script setup lang="ts"></script>

<template>
  <section class="hero">
    <!-- eyebrow pill -->
    <div class="hero-eyebrow">
      <div class="eyebrow-dot"></div>
      {{ $t('home.hero.eyebrow') }}
    </div>

    <!-- headline -->
    <h1>{{ $t('home.hero.title') }}<br /><strong>ya existe.</strong></h1>
    <p class="hero-sub">{{ $t('home.hero.subtitle') }}</p>

    <!-- search wrapper — buscador vacacional -->
    <div class="search-wrapper">
      <HomeSearchVacaciones />
    </div>

    <!-- stats strip -->
    <div class="hero-stats">
      <div class="hero-stat">
        <div class="hero-stat-num">1.200+</div>
        <div class="hero-stat-label">{{ $t('home.stats.properties') }}</div>
      </div>
      <div class="stat-sep"></div>
      <div class="hero-stat">
        <div class="hero-stat-num">12</div>
        <div class="hero-stat-label">{{ $t('home.stats.destinations') }}</div>
      </div>
      <div class="stat-sep"></div>
      <div class="hero-stat">
        <div class="hero-stat-num">8%</div>
        <div class="hero-stat-label">{{ $t('home.stats.commission') }}</div>
      </div>
      <div class="stat-sep"></div>
      <div class="hero-stat">
        <div class="hero-stat-num">4.9</div>
        <div class="hero-stat-label">{{ $t('home.stats.rating') }}</div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.hero {
  padding: $section-padding-y $section-padding-x 6.25rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $gap-extra-medium;
  background: var(--bg);
}

.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.4375rem;
  background: var(--bg-2);
  border: 1px solid var(--zinc-200);
  border-radius: $corner-radius-pill;
  padding: 0.375rem 0.875rem;
  font-size: $font-size-2xs;
  font-weight: 500;
  color: var(--text-2);
  letter-spacing: 0.019rem;
  animation: fadeUp 0.5s ease forwards;

  :root.dark-mode & {
    border-color: var(--zinc-700);
  }
}

.eyebrow-dot {
  width: 0.4375rem;
  height: 0.4375rem;
  background: var(--accent);
  border-radius: 50%;
}

h1 {
  font-size: clamp(2.25rem, 5vw, 4rem);
  font-weight: 300;
  color: var(--text);
  letter-spacing: -0.125rem;
  line-height: 1.05;
  max-width: 43.75rem;
  margin: 0;
  animation: fadeUp 0.5s 0.1s ease both;
}

h1 strong {
  font-weight: 600;
}

.hero-sub {
  font-size: $font-size-lg;
  font-weight: 300;
  color: var(--text-3);
  max-width: 28.75rem;
  line-height: 1.65;
  margin: 0;
  animation: fadeUp 0.5s 0.15s ease both;
}

.search-wrapper {
  width: 100%;
  max-width: 48.75rem;
  animation: fadeUp 0.6s 0.25s ease both;
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: $gap-extra-large;
  margin-top: 1.25rem;
  animation: fadeUp 0.6s 0.35s ease both;
}

.hero-stat {
  text-align: center;
}

.hero-stat-num {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--text);
  letter-spacing: -0.0625rem;
  line-height: 1;
}

.hero-stat-label {
  font-size: $font-size-xs;
  font-weight: 400;
  color: var(--text-3);
  margin-top: $gap-extra-tiny;
}

.stat-sep {
  width: 0.0625rem;
  height: 2rem;
  background: var(--border);
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(1rem);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@include media-breakpoint-down(md) {
  .hero {
    padding: $gap-extra-large $section-padding-x-sm 3.75rem;
  }

  .hero-stats {
    gap: 1.25rem;
  }

  .hero-stat-num {
    font-size: 1.375rem;
  }
}

@include media-breakpoint-down(sm) {
  .hero-stats {
    flex-wrap: wrap;
    gap: $gap-extra-medium;
  }
}
</style>
