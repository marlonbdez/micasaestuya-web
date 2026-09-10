<script setup lang="ts">
const { t } = useI18n()

const steps = [
  {
    num: '01',
    icon: '🔍',
    title: t('home.how_it_works.step1.title'),
    desc: t('home.how_it_works.step1.description')
  },
  {
    num: '02',
    icon: '💬',
    title: t('home.how_it_works.step2.title'),
    desc: t('home.how_it_works.step2.description')
  },
  {
    num: '03',
    icon: '🔐',
    title: t('home.how_it_works.step3.title'),
    desc: t('home.how_it_works.step3.description')
  },
  {
    num: '04',
    icon: '🏠',
    title: t('home.how_it_works.step4.title'),
    desc: t('home.how_it_works.step4.description')
  }
]
</script>

<template>
  <div class="section-full">
    <div class="section-inner">
      <div class="section-header-simple">
        <div class="section-label">{{ $t('home.how_it_works.label') }}</div>
        <h2 class="section-title">{{ $t('home.how_it_works.title') }}</h2>
      </div>
      <div class="steps-grid">
        <div v-for="step in steps" :key="step.num" class="step">
          <div class="step-num">{{ step.num }}</div>
          <div class="step-icon">{{ step.icon }}</div>
          <h3>{{ step.title }}</h3>
          <p>{{ step.desc }}</p>
        </div>
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

.section-header-simple {
  margin-bottom: $gap-large;
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
  margin: 0;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.0625rem;
  background: var(--border);
  border: 1px solid var(--border);
  border-radius: $corner-radius-large;
  overflow: hidden;
}

.step {
  background: var(--bg);
  padding: $gap-large 1.75rem;
  transition: background 0.22s cubic-bezier(0.4, 0, 0.2, 1);

  :root.dark-mode & {
    background: var(--zinc-900);
  }

  &:hover {
    background: var(--bg-2);
  }
}

.step-num {
  font-size: $font-size-sm;
  font-weight: 600;
  color: var(--text-3);
  letter-spacing: 0.031rem;
  margin-bottom: $gap-medium;
}

.step-icon {
  font-size: $gap-extra-medium; // 1.5rem ≈ 24px
  margin-bottom: 0.875rem;
  line-height: 1;
}

.step h3 {
  font-size: $font-size-base;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 $gap-small;
}

.step p {
  font-size: $font-size-sm;
  font-weight: 300;
  color: var(--text-3);
  line-height: 1.6;
  margin: 0;
}

@include media-breakpoint-down(md) {
  .section-full {
    padding: $section-padding-y-sm $section-padding-x-sm;
  }

  .steps-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@include media-breakpoint-down(sm) {
  .steps-grid {
    grid-template-columns: 1fr;
  }
}
</style>
