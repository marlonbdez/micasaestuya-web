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
      <div class="minimal-layout">
        <TheHeader minimal />
        <div class="minimal-layout__content">
          <slot />
        </div>
        <AuthModal />
        <LocaleModal />
        <TheFooter minimal />
      </div>
    </Body>
  </Html>
</template>

<style lang="scss" scoped>
.minimal-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  &__content {
    flex: 1;
  }
}
</style>
