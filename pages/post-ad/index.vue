<script setup lang="ts">
definePageMeta({
  // useLocalePath() va dentro: definePageMeta se extrae fuera del setup y no
  // puede referenciar nada declarado arriba.
  middleware() {
    return navigateTo(useLocalePath()('post-ad-basic-info'), { replace: true })
  }
})
</script>

<template>
  <div />
</template>
