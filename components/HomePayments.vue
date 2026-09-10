<script setup lang="ts">
const { t } = useI18n()

const cryptoMethods = [
  {
    name: t('home.payments.methods.usdt.name'),
    desc: t('home.payments.methods.usdt.description'),
    status: t('home.payments.methods.usdt.status'),
    icon: '₮',
    active: true
  },
  {
    name: t('home.payments.methods.usdc.name'),
    desc: t('home.payments.methods.usdc.description'),
    status: t('home.payments.methods.usdc.status'),
    icon: '◎',
    active: true
  },
  {
    name: t('home.payments.methods.btc.name'),
    desc: t('home.payments.methods.btc.description'),
    status: t('home.payments.methods.btc.status'),
    icon: '₿',
    active: false
  },
  {
    name: t('home.payments.methods.card.name'),
    desc: t('home.payments.methods.card.description'),
    status: t('home.payments.methods.card.status'),
    icon: '💳',
    active: true
  }
]
</script>

<template>
  <div class="section">
    <div class="crypto-row">
      <div class="crypto-left">
        <div class="section-label">{{ $t('home.payments.label') }}</div>
        <h2 class="section-title">{{ $t('home.payments.title') }}</h2>
        <p class="section-desc">{{ $t('home.payments.subtitle') }}</p>
        <div class="commission-display">
          <div class="commission-num">
            {{ $t('home.payments.commission.value') }}
          </div>
          <div class="commission-text">
            <h4>{{ $t('home.payments.commission.title') }}</h4>
            <p>{{ $t('home.payments.commission.description') }}</p>
          </div>
        </div>
      </div>
      <div class="crypto-right">
        <div class="crypto-card">
          <div class="crypto-card-header">
            {{ $t('home.payments.methods.header') }}
          </div>
          <div
            v-for="method in cryptoMethods"
            :key="method.icon"
            class="crypto-item"
          >
            <div class="crypto-icon">{{ method.icon }}</div>
            <div class="crypto-info">
              <div class="crypto-name">{{ method.name }}</div>
              <div class="crypto-desc">{{ method.desc }}</div>
            </div>
            <div
              class="crypto-status"
              :class="method.active ? 'status-live' : 'status-soon'"
            >
              {{ method.status }}
            </div>
          </div>
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
  margin: 0 0 $gap-medium;
}

.section-desc {
  font-size: $font-size-base;
  font-weight: 300;
  color: var(--text-3);
  max-width: 27.5rem;
  line-height: 1.65;
  margin: 0 0 $gap-extra-large;
}

.crypto-row {
  display: flex;
  gap: $gap-huge;
  align-items: center;
}

.crypto-left {
  flex: 1;
}

.crypto-right {
  flex-shrink: 0;
  width: 18.75rem;
}

.crypto-card {
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: $corner-radius-large;
  overflow: hidden;
}

.crypto-card-header {
  padding: $gap-medium 1.25rem;
  border-bottom: 1px solid var(--border);
  font-size: $font-size-2xs;
  font-weight: 600;
  color: var(--text-3);
  letter-spacing: 0.05rem;
  text-transform: uppercase;
}

.crypto-item {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1.25rem;
  border-bottom: 1px solid var(--border);
  transition: background 0.22s cubic-bezier(0.4, 0, 0.2, 1);

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: var(--zinc-200);

    :root.dark-mode & {
      background: var(--zinc-700);
    }
  }
}

.crypto-icon {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 700;
  flex-shrink: 0;
  background: var(--bg);
  color: var(--text);

  :root.dark-mode & {
    background: var(--zinc-900);
  }
}

.crypto-info {
  flex: 1;
  min-width: 0;
}

.crypto-name {
  font-size: $font-size-sm;
  font-weight: 500;
  color: var(--text);
}

.crypto-desc {
  font-size: $font-size-2xs;
  color: var(--text-3);
  margin-top: 0.0625rem;
}

.crypto-status {
  font-size: $font-size-2xs;
  font-weight: 600;
  padding: 0.1875rem 0.625rem;
  border-radius: $corner-radius-pill;
  white-space: nowrap;
}

.status-live {
  background: rgba(52, 199, 89, 0.12);
  color: #34c759;
}

.status-soon {
  background: var(--zinc-200);
  color: var(--text-3);

  :root.dark-mode & {
    background: var(--zinc-700);
  }
}

.commission-display {
  margin-top: $gap-large;
  padding: $gap-extra-medium;
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: $corner-radius-large;
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.commission-num {
  font-size: 3.25rem;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.125rem;
  line-height: 1;
  flex-shrink: 0;
}

.commission-text h4 {
  font-size: $font-size-md;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 $gap-extra-tiny;
}

.commission-text p {
  font-size: $font-size-xs;
  font-weight: 300;
  color: var(--text-3);
  line-height: 1.5;
  margin: 0;
}

@include media-breakpoint-down(md) {
  .section {
    padding: $section-padding-y-sm $section-padding-x-sm;
  }

  .crypto-row {
    flex-direction: column;
    gap: $gap-large;
  }

  .crypto-right {
    width: 100%;
  }
}
</style>
