import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  {
    test: {
      name: 'unit',
      include: ['tests/unit/**/*.{test,spec}.ts'],
      environment: 'node',
      globals: true
    }
  },
  {
    test: {
      name: 'nuxt',
      include: ['tests/nuxt/**/*.{test,spec}.ts'],
      environment: 'node',
      globals: true
    },
  }
])
