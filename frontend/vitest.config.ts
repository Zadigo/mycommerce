import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'nuxt',
    projects: [
      {
        extends: true,
        test: {
          name: 'nuxt-pages',
          include: ['tests/nuxt/**/*.spec.{test}.ts'],
          environment: 'nuxt'
        }
      }
    ],
  }
})
