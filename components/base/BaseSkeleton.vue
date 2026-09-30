<template>
  <span class="skeleton" aria-hidden="true" />
</template>

<style lang="scss" scoped>
.skeleton {
  display: block;
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-sm);
  background: var(--bg-3);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.15),
      transparent
    );
    animation: shimmer 1.5s infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    &::after {
      animation: none;
    }
  }
}

@keyframes shimmer {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(100%);
  }
}
</style>
