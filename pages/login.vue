<script setup lang="ts">
import { string, object } from 'yup'
import { useForm } from 'vee-validate'

import { ILoginInput } from '~/core/types'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: object({
    email: string().required().email(),
    password: string().required().min(6)
  })
})

const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')
const remember = ref(false)
const showError = ref<boolean>(false)
const loading = ref<boolean>(false)
const showPassword = ref<boolean>(false)

const passwordOptions = computed(() =>
  showPassword.value
    ? { icon: 'eye', type: 'text' }
    : { icon: 'eye-closed', type: 'password' }
)

const onSubmit = handleSubmit(async (values) => {
  try {
    loading.value = true
    const credentials: ILoginInput = {
      email: values.email,
      password: values.password,
      remember: remember.value
    }
    await authStore.login(credentials)
    navigateTo('/')
  } catch (error) {
    console.error('Unable to login', error)
    showError.value = true
  } finally {
    loading.value = false
  }
})

definePageMeta({
  middleware: ['auth']
})
</script>

<template>
  <div class="container">
    <h2>Sign In</h2>
    <BaseAlert v-if="showError" variant="error">
      Invalid username or password
    </BaseAlert>
    <form @submit.prevent="onSubmit()">
      <BaseInput
        id="email"
        v-model="email"
        v-bind="emailAttrs"
        label="Email"
        :error-message="errors?.email"
      />
      <BaseInput
        id="password"
        v-model="password"
        v-bind="passwordAttrs"
        label="Password"
        :type="passwordOptions.type"
        :icon="passwordOptions.icon"
        :error-message="errors?.password"
        @icon-click="showPassword = !showPassword"
      />
      <BaseCheckbox id="remember" v-model:checked="remember">
        Remember
      </BaseCheckbox>
      <BaseCta type="submit" :disabled="loading">
        <BaseSpinner v-if="loading" /> Login
      </BaseCta>
      <BaseCta to="/signup"> Don't have access? Create a new user </BaseCta>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.form-group {
  margin-bottom: 2rem;
}
</style>
