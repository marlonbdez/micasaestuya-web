<script setup lang="ts">
import { ThemeType } from '~/core/types'

const colorMode = useColorMode()
const isDarkMode = ref(false)

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
}

const themeIcon = computed(() => (isDarkMode.value ? 'moon' : 'sun'))
const themeLabel = computed(() =>
  isDarkMode.value ? 'Switch to light mode' : 'Switch to dark mode'
)

watch(isDarkMode, (newVal) => {
  colorMode.preference = newVal
    ? ThemeType.Dark.toLowerCase()
    : ThemeType.Light.toLowerCase()
})

onMounted(() => {
  isDarkMode.value = colorMode.value === ThemeType.Dark.toLowerCase()
})
</script>

<template>
  <BaseCta
    data-cy="theme-switcher-button"
    variant="flat"
    :aria-label="themeLabel"
    @click="toggleTheme"
  >
    <BaseIcon :icon="themeIcon" size="sm" />
    <span class="sr-only">{{ themeLabel }}</span>
  </BaseCta>
</template>
