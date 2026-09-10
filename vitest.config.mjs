import { fileURLToPath } from 'node:url'
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    globals: true,
    // include: ["**/*.nuxt.spec.ts"],
    environment: 'jsdom',
    environmentOptions: {
      nuxt: {
        rootDir: fileURLToPath(new URL('./', import.meta.url))
      }
    },
    setupFiles: ['./test/setup/setup.js'],
    coverage: {
      reporter: ['text', 'json', 'html']
    }
  }
})
