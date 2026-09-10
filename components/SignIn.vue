<script setup lang="ts">
import { string, object } from 'yup'
import { useForm } from 'vee-validate'
import type { ILoginInput } from '@/core/types'
import { useAuthStore } from '@/stores/auth'
const { t } = useI18n()
const authStore = useAuthStore()

const emit = defineEmits<{
  success: [boolean]
  'show-signup': [boolean]
}>()

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: object({
    email: string()
      .required(() => t('modals.auth.common.email_required'))
      .email(() => t('modals.auth.common.email_invalid')),
    password: string()
      .required(t('modals.auth.common.password_required'))
      .min(6, t('modals.auth.common.password_min_length'))
  })
})

const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')
const remember = ref(false)
const showError = ref(false)
const loading = ref(false)
const showPassword = ref(false)

const passwordOptions = computed(() =>
  showPassword.value
    ? { icon: 'eye', type: 'text' }
    : { icon: 'eye-closed', type: 'password' }
)

const onSubmit = handleSubmit(async (values) => {
  try {
    loading.value = true
    showError.value = false

    const credentials: ILoginInput = {
      email: values.email,
      password: values.password,
      remember: remember.value
    }
    await authStore.login(credentials)
    emit('success', true)
  } catch (error) {
    console.error('Unable to login', error)
    showError.value = true
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="signin">
    <BaseAlert v-if="showError" data-cy="signin-error-message" variant="error">
      {{ $t('modals.auth.sign_in.error') }}
    </BaseAlert>
    <form data-cy="signin-form" @submit.prevent="onSubmit">
      <BaseInput
        id="signin-email"
        v-model="email"
        data-cy="signin-email-input"
        v-bind="emailAttrs"
        :label="$t('modals.auth.common.email')"
        :error-message="errors?.email"
      />
      <BaseInput
        id="signin-password"
        v-model="password"
        data-cy="signin-password-input"
        v-bind="passwordAttrs"
        :label="$t('modals.auth.common.password')"
        :type="passwordOptions?.type"
        :icon="passwordOptions?.icon"
        :error-message="errors?.password"
        @icon-click="showPassword = !showPassword"
      />
      <BaseCheckbox
        id="signin-remember"
        v-model="remember"
        data-cy="signin-remember-checkbox"
      >
        {{ $t('modals.auth.sign_in.remember_me') }}
      </BaseCheckbox>
      <BaseCta
        id="signin-submit"
        data-cy="signin-submit-button"
        class="signin__button"
        type="submit"
        :disabled="loading"
      >
        <BaseSpinner v-if="loading" />
        {{ $t('modals.auth.sign_in.login') }}
      </BaseCta>
      <BaseCta
        data-cy="signin-show-signup-button"
        class="signin__button"
        variant="flat"
        type="button"
        @click="emit('show-signup', true)"
      >
        {{ $t('modals.auth.sign_in.suggestion') }}
      </BaseCta>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.form-group {
  width: 100%;
  margin-bottom: 2rem;
}

.signin {
  width: 100%;

  &__button {
    width: 100%;

    & + & {
      margin-top: $gap-medium;
    }
  }
}
</style>
```
