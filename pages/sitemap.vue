<script setup lang="ts">
defineI18nRoute({
  paths: {
    'es-CU': '/mapa-web',
    'es-DO': '/mapa-web',
    'en-CU': '/sitemap',
    'en-DO': '/sitemap'
  }
})

const { t } = useI18n()
const localePath = useLocalePath()

// Las páginas públicas que existen hoy. Al añadir una, se añade aquí.
const links = computed(() => [
  { route: 'index', label: t('header.explore') },
  { route: 'publish-listing', label: t('footer.hosts.publish') },
  { route: 'about-us', label: t('footer.about.who_we_are') },
  { route: 'faq', label: t('footer.help.faq') },
  { route: 'privacy-policy', label: t('footer.legal.privacy') },
  { route: 'cookie-policy', label: t('footer.legal.cookies') },
  { route: 'terms-and-conditions', label: t('footer.legal.terms') }
])

useHead(() => ({ title: t('info_pages.sitemap.title') }))
</script>

<template>
  <main class="sitemap">
    <h1 class="sitemap__title">{{ t('info_pages.sitemap.title') }}</h1>
    <ul class="sitemap__list">
      <li v-for="link in links" :key="link.route">
        <BaseCta is-link :to="localePath(link.route)">
          {{ link.label }}
        </BaseCta>
      </li>
    </ul>
  </main>
</template>

<style lang="scss" scoped>
.sitemap {
  max-width: px-to-rem(680);
  margin: 0 auto;
  padding: $gap-huge $gap-medium $gap-extra-huge;

  &__title {
    @include font-outfit-semibold;
    font-size: px-to-rem(30);
    margin: 0 0 $gap-large;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: $gap-small;
    list-style: none;
    margin: 0;
    padding: 0;
  }
}
</style>
