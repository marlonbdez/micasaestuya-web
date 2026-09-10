<script setup lang="ts">
const localePath = useLocalePath()
</script>

<template>
  <nuxt-link :to="localePath('/')">
    <img
      src="~/assets/images/micasaestuya_logo.png"
      alt="micasaestuya logo"
      width="80"
      height="47"
      class="logo"
    />
  </nuxt-link>
</template>

<style lang="scss" scoped>
.logo {
  position: relative;
  width: 100%;
  max-width: 5rem;
}
</style>
