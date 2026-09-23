<script setup lang="ts">
const localePath = useLocalePath()
</script>

<template>
  <nuxt-link :to="localePath('/')" class="the-logo">
    <span class="the-logo__part">mi</span>
    <span class="the-logo__part the-logo__part--accent">casa</span>
    <span class="the-logo__part">estuya</span>
  </nuxt-link>
</template>

<style lang="scss" scoped>
.the-logo {
  font-family: var(--font);
  font-size: px-to-rem(22);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text);
  text-decoration: none;
  white-space: nowrap;
}

.the-logo__part--accent {
  color: var(--accent);
}
</style>
