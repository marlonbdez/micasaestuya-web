<template>
  <section class="home-publicity">
    <div class="container">
      <h2 class="home-publicity__title">Lorem Ipsum</h2>
      <h3 class="home-publicity__subtitle">
        Lorem ipsum dolor sit amet. Et veniam suscipit rem quod voluptatum ea
        fugit voluptatibus a placeat aspernatur.
      </h3>
      <hr class="home-publicity__divider" />
      <div class="wrapper-cards">
        <div class="card">
          <img
            class="card__image"
            src="~/assets/images/home_publicity_1.webp"
            width="420"
            height="260"
            alt="Home 1"
          />
          <div class="card__body">
            <h4 class="card__title">
              <BaseCta
                is-link
                to="/lorem-ipsum"
                variant="flat"
                class="card__cta"
              >
                Lorem Ipsum
              </BaseCta>
            </h4>
            <p class="card__text">
              Et veniam suscipit rem quod voluptatum ea fugit voluptatibus a
              placeat aspernatur.
            </p>
          </div>
        </div>
        <div class="card">
          <img
            class="card__image"
            src="~/assets/images/home_publicity_2.webp"
            width="420"
            height="260"
            alt="Home 2"
          />
          <div class="card__body">
            <h4 class="card__title">
              <BaseCta
                is-link
                to="/lorem-ipsum"
                variant="flat"
                class="card__cta"
              >
                Lorem Ipsum
              </BaseCta>
            </h4>
            <p class="card__text">
              Et veniam suscipit rem quod voluptatum ea fugit voluptatibus a
              placeat aspernatur.
            </p>
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
