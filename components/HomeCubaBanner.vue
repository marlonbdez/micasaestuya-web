<script setup lang="ts"></script>

<template>
  <div class="section">
    <div class="cuba-banner">
      <div class="cuba-content">
        <div class="cuba-tag">
          <div class="cuba-tag-dot"></div>
          {{ $t('home.cuba_banner.tag') }}
        </div>
        <h2 class="cuba-title">{{ $t('home.cuba_banner.title') }}</h2>
        <p class="cuba-desc">{{ $t('home.cuba_banner.subtitle') }}</p>
        <div class="cuba-feats">
          <div class="cuba-feat">
            <div class="cuba-feat-icon">🔒</div>
            {{ $t('home.cuba_banner.features.crypto') }}
          </div>
          <div class="cuba-feat">
            <div class="cuba-feat-icon">✓</div>
            {{ $t('home.cuba_banner.features.verified') }}
          </div>
          <div class="cuba-feat">
            <div class="cuba-feat-icon">%</div>
            {{ $t('home.cuba_banner.features.commission') }}
          </div>
          <div class="cuba-feat">
            <div class="cuba-feat-icon">🇪🇸</div>
            {{ $t('home.cuba_banner.features.spanish') }}
          </div>
        </div>
        <button type="button" class="btn-inv">
          {{ $t('home.cuba_banner.button') }}
        </button>
      </div>
      <div class="cuba-visual">
        <div class="cuba-flag">🇨🇺</div>
        <div class="cuba-stats-right">
          <div class="cuba-stat-desc">Propiedades en beta</div>
          <div class="cuba-stat-big">380</div>
          <div class="cuba-stat-cities">La Habana · Trinidad · Varadero</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.section {
  padding: $section-padding-y $section-padding-x;
  max-width: $max-width-content;
  margin: 0 auto;
}

.cuba-banner {
  background: var(--text);
  color: var(--bg);
  border-radius: $corner-radius-large;
  padding: $gap-extra-huge 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $gap-extra-large;
  position: relative;
  overflow: hidden;
}

.cuba-banner::before {
  content: '';
  position: absolute;
  right: -3.75rem;
  top: -3.75rem;
  width: 20rem;
  height: 20rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
}

.cuba-banner::after {
  content: '';
  position: absolute;
  right: 3.75rem;
  bottom: -5rem;
  width: 12.5rem;
  height: 12.5rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
}

.cuba-content {
  position: relative;
  z-index: 1;
  max-width: 32.5rem;
}

.cuba-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: $corner-radius-pill;
  padding: 0.3125rem $gap-extra-small;
  font-size: $font-size-2xs;
  font-weight: 600;
  letter-spacing: 0.0625rem;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: $gap-medium;
}

.cuba-tag-dot {
  width: 0.375rem;
  height: 0.375rem;
  background: var(--accent);
  border-radius: 50%;
}

.cuba-title {
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -0.0625rem;
  margin: 0 0 0.875rem;
  color: var(--bg);
}

.cuba-desc {
  font-size: $font-size-base;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.65;
  margin: 0 0 1.75rem;
}

.cuba-feats {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
  margin-bottom: $gap-large;
}

.cuba-feat {
  display: flex;
  align-items: center;
  gap: 0.4375rem;
  font-size: $font-size-sm;
  color: rgba(255, 255, 255, 0.75);
}

.cuba-feat-icon {
  width: 1.5rem;
  height: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: $corner-radius-small;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $font-size-sm;
}

.btn-inv {
  display: inline-flex;
  align-items: center;
  gap: $gap-small;
  background: var(--bg);
  color: var(--text);
  padding: 0.8125rem 1.625rem;
  border-radius: $corner-radius-pill;
  font-family: var(--font);
  font-size: $font-size-md;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;

  &:hover {
    opacity: 0.88;
    transform: scale(0.98);
  }
}

.cuba-visual {
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  text-align: right;
}

.cuba-flag {
  font-size: 5rem;
  line-height: 1;
  color: rgba(255, 255, 255, 0.15);
  user-select: none;
}

.cuba-stats-right {
  margin-top: $gap-medium;
  text-align: right;
}

.cuba-stat-desc {
  font-size: $font-size-sm;
  color: rgba(255, 255, 255, 0.4);
  font-weight: 300;
}

.cuba-stat-big {
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.125rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.1;
}

.cuba-stat-cities {
  font-size: $font-size-xs;
  color: rgba(255, 255, 255, 0.3);
  margin-top: $gap-extra-tiny;
}

@include media-breakpoint-down(md) {
  .section {
    padding: $section-padding-y-sm $section-padding-x-sm;
  }

  .cuba-banner {
    flex-direction: column;
    padding: $gap-extra-large $gap-large;
    text-align: center;
  }

  .cuba-feats {
    justify-content: center;
  }

  .cuba-visual {
    display: none;
  }
}
</style>
