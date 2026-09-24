<script setup lang="ts">
// El título y la descripción de nuxt.config.ts son el valor de reserva; aquí se
// traducen al idioma activo.
const { t } = useI18n()

useHead(() => ({
  title: t('meta.title'),
  meta: [{ name: 'description', content: t('meta.description') }]
}))
</script>

<template>
  <div>
    <NuxtLoadingIndicator :color="'var(--accent)'" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
