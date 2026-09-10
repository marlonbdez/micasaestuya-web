<script setup lang="ts">
import * as yup from 'yup'
import { useForm } from 'vee-validate'
import { useAuthStore } from '~/stores/auth'
import type { IRegisterInput } from '~/core/types'
import { alphaSpaceRegex } from '~/core/regex'
const { t } = useI18n()

const authStore = useAuthStore()

const emit = defineEmits<{
  success: [boolean]
  'show-signup': [boolean]
}>()

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: yup.object({
    firstName: yup
      .string()
      .matches(alphaSpaceRegex, t('modals.auth.sign_up.first_name_invalid'))
      .required(t('modals.auth.sign_up.first_name_required')),
    lastName: yup
      .string()
      .matches(alphaSpaceRegex, t('modals.auth.sign_up.last_name_invalid'))
      .required(t('modals.auth.sign_up.last_name_required')),
    email: yup
      .string()
      .required(t('modals.auth.common.email_required'))
      .email(t('modals.auth.common.email_invalid')),
    password: yup
      .string()
      .required(t('modals.auth.common.password_required'))
      .min(6, t('modals.auth.common.password_min_length')),
    passwordConfirmation: yup
      .string()
      .required(t('modals.auth.sign_up.password_confirmation_required'))
      .oneOf(
        [yup.ref('password')],
        t('modals.auth.sign_up.passwords_mismatch')
      ),
    acceptedTerms: yup
      .bool()
      .required(t('modals.auth.sign_up.terms_not_accepted'))
  })
})

const [firstName, firstNameAttrs] = defineField('firstName')
const [lastName, lastNameAttrs] = defineField('lastName')
const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')
const [passwordConfirmation, passwordConfirmationAttrs] = defineField(
  'passwordConfirmation'
)
const [acceptedTerms, acceptedTermsAttrs] = defineField('acceptedTerms')
const showError = ref<boolean>(false)
const loading = ref<boolean>(false)
const showPassword = ref<boolean>(false)
const showPasswordConfirmation = ref<boolean>(false)

const passwordOptions = computed(() =>
  showPassword.value
    ? { icon: 'eye', type: 'text' }
    : { icon: 'eye-closed', type: 'password' }
)

const passwordConfirmationOptions = computed(() =>
  showPasswordConfirmation.value
    ? { icon: 'eye', type: 'text' }
    : { icon: 'eye-closed', type: 'password' }
)

const onSubmit = handleSubmit(async (values) => {
  try {
    loading.value = true
    showError.value = false

    const credentials: IRegisterInput = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password
    }
    await authStore.register(credentials)
    emit('success', true)
  } catch (error) {
    console.error('Unable to register the user', error)
    showError.value = true
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="signup">
    <BaseAlert v-if="showError" data-cy="signup-error-message" variant="error">
      {{ $t('modals.auth.sign_up.error') }}
    </BaseAlert>
    <form data-cy="signup-form" @submit.prevent="onSubmit()">
      <BaseInput
        id="signup-first-name"
        v-model="firstName"
        data-cy="signup-first-name-input"
        v-bind="firstNameAttrs"
        :label="$t('modals.auth.sign_up.first_name')"
        :error-message="errors?.firstName"
      />
      <BaseInput
        id="signup-last-name"
        v-model="lastName"
        data-cy="signup-last-name-input"
        v-bind="lastNameAttrs"
        :label="$t('modals.auth.sign_up.last_name')"
        :error-message="errors?.lastName"
      />
      <BaseInput
        id="signup-email"
        v-model="email"
        data-cy="signup-email-input"
        v-bind="emailAttrs"
        :label="$t('modals.auth.common.email')"
        :error-message="errors?.email"
      />
      <BaseInput
        id="signup-password"
        v-model="password"
        data-cy="signup-password-input"
        v-bind="passwordAttrs"
        :label="$t('modals.auth.common.password')"
        :type="passwordOptions.type"
        :icon="passwordOptions.icon"
        :error-message="errors?.password"
        @icon-click="showPassword = !showPassword"
      />
      <BaseInput
        id="signup-password-confirmation"
        v-model="passwordConfirmation"
        data-cy="signup-password-confirmation-input"
        v-bind="passwordConfirmationAttrs"
        :label="$t('modals.auth.sign_up.password_confirmation')"
        :type="passwordConfirmationOptions.type"
        :icon="passwordConfirmationOptions.icon"
        :error-message="errors?.passwordConfirmation"
        @icon-click="showPasswordConfirmation = !showPasswordConfirmation"
      />
      <BaseCheckbox
        id="signup-accepted-terms"
        v-model="acceptedTerms"
        data-cy="signup-accepted-terms-checkbox"
        v-bind="acceptedTermsAttrs"
        :error-message="errors?.acceptedTerms"
      >
        {{ $t('modals.auth.sign_up.terms_accept') }}
      </BaseCheckbox>
      <BaseCta
        data-cy="signup-submit-button"
        class="signup__button"
        type="submit"
        :disabled="loading"
      >
        <BaseSpinner v-if="loading" /> {{ $t('modals.auth.sign_up.continue') }}
      </BaseCta>
      <BaseCta
        data-cy="signup-show-signin-button"
        class="signup__button"
        variant="flat"
        type="button"
        @click="emit('show-signup', true)"
      >
        {{ $t('modals.auth.sign_up.suggestion') }}
      </BaseCta>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.form-group {
  width: 100%;
  margin-bottom: 2rem;
}

.signup {
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
