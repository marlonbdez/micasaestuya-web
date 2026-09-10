<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})
</script>

<template>
  <main>
    <HomeSearch />
    <HomePublicity />
  </main>
</template>

<style lang="scss" scoped>
h1 {
  @include font-roboto-condensed-regular;
  color: var(--color-red-dark);
  text-align: center;
}
</style>
