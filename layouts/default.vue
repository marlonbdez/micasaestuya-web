<script setup lang="ts">
const head = useLocaleHead({
  addDirAttribute: true,
  addSeoAttributes: true
})
const htmlAttrs = computed(() => head.value.htmlAttrs!)
</script>

<template>
  <Html :lang="htmlAttrs.lang" :dir="htmlAttrs.dir">
    <Body>
      <div class="wrapper">
        <TheHeader />
        <slot />
        <AuthModal />
        <LocaleModal />
        <TheFooter />
      </div>
    </Body>
  </Html>
</template>
