<script setup lang="ts">
// Homepage rediseñada (tal cual está en main) — coexiste con pages/index.vue,
// que conserva el home actual (HomeSearch + HomePublicity).
// Homepage is public — no auth middleware required
</script>

<template>
  <main>
    <TheHero />
    <HomeDestinations />
    <HomeFeaturedProperties />
    <HomeCubaBanner />
    <HomeHowItWorks />
    <HomePayments />
    <HomeHostCTA />
  </main>
</template>

<style lang="scss" scoped>
main {
  background: var(--app-background-color);
}
</style>
