<script setup lang="ts">
// Página de texto (Quiénes somos, FAQ, legales). El contenido vive en i18n,
// en `info_pages.<pageKey>`: un título y una lista de secciones con párrafos.
interface Props {
  pageKey: string
  // Las páginas legales llevan un aviso: son un borrador sin revisión legal.
  draft?: boolean
}

interface ISection {
  title: string
  paragraphs: string[]
}

const props = withDefaults(defineProps<Props>(), { draft: false })

const { t, tm, rt } = useI18n()

const CONTACT_EMAIL = 'micasaestuya@gmail.com'

// El email va como parámetro y no escrito en el texto: en vue-i18n la arroba
// es sintaxis (mensajes enlazados).
const params = computed(() => ({
  email: CONTACT_EMAIL,
  contact: t('info_pages.contact_email_label', { email: CONTACT_EMAIL })
}))

const sections = computed(() =>
  (tm(`info_pages.${props.pageKey}.sections`) as unknown as ISection[]).map(
    (section) => ({
      title: rt(section.title),
      paragraphs: section.paragraphs.map((paragraph) =>
        rt(paragraph, params.value)
      )
    })
  )
)

useHead(() => ({ title: t(`info_pages.${props.pageKey}.title`) }))
</script>

<template>
  <main class="info-page">
    <h1 class="info-page__title">{{ t(`info_pages.${pageKey}.title`) }}</h1>

    <BaseAlert v-if="draft" variant="warning" class="info-page__notice">
      {{ t('info_pages.draft_notice') }}
    </BaseAlert>

    <section
      v-for="section in sections"
      :key="section.title"
      class="info-page__section"
    >
      <h2 class="info-page__heading">{{ section.title }}</h2>
      <p
        v-for="paragraph in section.paragraphs"
        :key="paragraph"
        class="info-page__paragraph"
      >
        {{ paragraph }}
      </p>
    </section>

    <slot />
  </main>
</template>

<style lang="scss" scoped>
.info-page {
  max-width: px-to-rem(680);
  margin: 0 auto;
  padding: $gap-huge $gap-medium $gap-extra-huge;

  &__title {
    @include font-outfit-semibold;
    font-size: px-to-rem(30);
    margin: 0 0 $gap-large;
  }

  &__notice {
    margin-bottom: $gap-large;
  }

  &__section + &__section {
    margin-top: $gap-large;
  }

  &__heading {
    @include font-outfit-semibold;
    font-size: $font-size-lg;
    margin: 0 0 $gap-small;
  }

  &__paragraph {
    color: var(--text-2);
    line-height: 1.6;
    margin: 0 0 $gap-small;
  }
}
</style>
