<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
const { t } = useI18n()

const authStore = useAuthStore()
const isVisible = ref(false)
const showSignUp = ref(false)

const hideModal = () => {
  isVisible.value = false
  showSignUp.value = false
}

const title = computed(() =>
  showSignUp.value
    ? t('modals.auth.sign_up.title')
    : t('modals.auth.sign_in.title')
)
onMounted(() => {
  authStore.$onAction(({ name }) => {
    if (name === 'showAuthModal') {
      isVisible.value = true
    }
  })
})
</script>

<template>
  <Transition name="modal-in">
    <div v-if="isVisible" data-cy="auth-modal" class="modal">
      <div v-click-outside="hideModal" class="modal__dialog">
        <div class="modal__header">
          <BaseCta
            v-if="showSignUp"
            class="modal__go-back"
            variant="flat"
            @click="showSignUp = false"
          >
            <BaseIcon icon="chevron-left" size="md" />
          </BaseCta>
          <h2 class="modal__title">
            {{ title }}
          </h2>
          <BaseCta
            class="modal__close"
            variant="flat"
            @click="isVisible = false"
          >
            <BaseIcon icon="close" size="md" />
          </BaseCta>
        </div>
        <div class="modal__content">
          <Transition name="fade" mode="out-in">
            <SignUp
              v-if="showSignUp"
              @success="hideModal"
              @show-signup="showSignUp = false"
            />
            <SignIn
              v-else
              @success="hideModal"
              @show-signup="showSignUp = true"
            />
          </Transition>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.modal {
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-items: flex-start;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: $zindex-modal-backdrop;
  backdrop-filter: blur(3px);

  @include media-breakpoint-up(sm) {
    background: var(--background-backdrop);
  }

  &__dialog {
    position: relative;
    background: var(--bg);
    height: 100%;
    border-radius: $corner-radius-sm;
    transition: height var(--transition);

    @include media-breakpoint-up(sm) {
      height: auto;
      margin: auto;
      width: px-to-rem(380);
    }
  }

  &__header {
    position: relative;
    height: px-to-rem(56);
    width: 100%;
    padding: $gap-medium;
    border-bottom: px-to-rem(1) solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__title {
    @include font-outfit-medium;
    font-size: px-to-rem(20);
    margin: 0;
    text-align: center;
    width: 100%;
  }

  &__content {
    padding: $gap-medium;
    border-radius: $corner-radius-sm;
    width: 100%;
    height: 100%;
    overflow: auto;

    @include media-breakpoint-up(sm) {
      height: auto;
      max-height: px-to-rem(700);
    }
  }

  &__button {
    width: 100%;
    margin-bottom: $gap-extra-medium;
  }
}
</style>
