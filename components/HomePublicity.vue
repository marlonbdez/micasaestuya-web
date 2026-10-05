<script setup lang="ts">
import seekImage from '~/assets/images/home_publicity_1.webp'
import offerImage from '~/assets/images/home_publicity_2.webp'

const { t } = useI18n()
const localePath = useLocalePath()

const cards = computed(() => [
  {
    id: 'seek',
    image: seekImage,
    to: localePath('explore'),
    title: t('home.publicity.seek.title'),
    text: t('home.publicity.seek.text')
  },
  {
    id: 'offer',
    image: offerImage,
    to: localePath('publish-listing'),
    title: t('home.publicity.offer.title'),
    text: t('home.publicity.offer.text')
  }
])
</script>

<template>
  <section class="home-publicity">
    <div class="container">
      <h2 class="home-publicity__title">{{ t('home.publicity.title') }}</h2>
      <h3 class="home-publicity__subtitle">
        {{ t('home.publicity.subtitle') }}
      </h3>
      <hr class="home-publicity__divider" />
      <div class="wrapper-cards">
        <div v-for="card in cards" :key="card.id" class="card">
          <img
            class="card__image"
            :src="card.image"
            width="420"
            height="260"
            alt=""
          />
          <div class="card__body">
            <h4 class="card__title">
              <BaseCta is-link :to="card.to" variant="flat" class="card__cta">
                {{ card.title }}
              </BaseCta>
            </h4>
            <p class="card__text">{{ card.text }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.home-publicity {
  padding: $gap-extra-medium 0;
  margin-bottom: $gap-huge;

  &__title {
    @include font-roboto-bold;
    text-align: center;
    font-size: 1.2rem;
    text-transform: uppercase;

    @include media-breakpoint-up(lg) {
      font-size: 1.6rem;
    }
  }

  &__subtitle {
    @include font-roboto-regular;
    text-align: center;
    font-size: 1rem;
    display: block;
    line-height: 1.5rem;
    margin-bottom: $gap-extra-medium;

    @include media-breakpoint-up(lg) {
      margin-bottom: $gap-large;
    }
  }

  &__divider {
    width: 15%;
    background-color: var(--primary-button-color);
    border: 0;
    height: 0.125rem;
    margin-bottom: $gap-extra-medium;

    @include media-breakpoint-up(sm) {
      margin-bottom: $gap-huge;
    }
  }

  .wrapper-cards {
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $gap-extra-medium;

    @include media-breakpoint-up(sm) {
      flex-direction: row;
      justify-content: space-evenly;
    }

    @include media-breakpoint-up(lg) {
      width: 85%;
    }
  }

  .card {
    position: relative;
    max-width: 26.25rem;
    overflow: hidden;

    @include media-breakpoint-up(sm) {
      width: 48%;
    }

    &__image {
      border-radius: 1rem;
      max-width: 100%;
      max-height: 18.75rem;
      height: auto;
      overflow: hidden;
    }

    &__body {
      font-size: 1rem;
    }

    &__title {
      @include font-roboto-bold;
      padding: $gap-medium 0;
      margin: 0;
    }

    &__text {
      @include font-roboto-light;
      font-size: 0.875rem;
      line-height: 1.25rem;
      margin: 0;
    }
  }
}
</style>
