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
      <div class="flow-layout">
        <TheHeader minimal />
        <main class="flow-layout__content">
          <slot />
        </main>
        <LocaleModal />
        <TheFooter minimal />
      </div>
    </Body>
  </Html>
</template>

<style lang="scss" scoped>
.flow-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  &__content {
    flex: 1;
  }
}
</style>
