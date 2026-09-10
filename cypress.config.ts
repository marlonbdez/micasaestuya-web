import { defineConfig } from 'cypress'
import { config } from 'dotenv'

config()

const baseUrl = process.env.CYPRESS_BASE_URL || 'http://localhost:3000'
const apiBase = process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3001/api'

export default defineConfig({
  video: true,
  env: {
    API_BASE: apiBase
  },
  e2e: {
    defaultCommandTimeout: 10000,
    requestTimeout: 60000,
    responseTimeout: 60000,
    viewportWidth: 1920,
    viewportHeight: 1080,
    baseUrl
  }
})
