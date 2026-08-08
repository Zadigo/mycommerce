import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'

export default defineConfig({
  test: {
    exclude: [
      'node_modules',
      '.nuxt',
      'dist',
      'test/__fixtures__',
      'test/__mocks__'
    ],
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: [ 'text', 'json', 'html', 'clover' ],
      exclude: [
        'i18n/locales/**',
        'app/assets/**',
      ]
    },
    env: {
      NODE_ENV: 'test'
    },
    projects: [
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: [ 'test/nuxt/**/*.{test,spec}.ts' ],
          environment: 'nuxt',
          testTimeout: 20000,
          tags: [
            {
              name: 'unit',
              description: 'Tests that are focused on a single unit of code, such as a function or component.',
            },
            {
              name: 'isolation',
              description: 'Tests that are isolated and do not depend on external services or state.'
            }
          ]
        }
      }),
      await defineVitestProject({
        test: {
          name: 'integration',
          include: [ 'test/integration/**/*.{test,spec}.ts' ],
          environment: 'node',
          testTimeout: 20000,
          tags: [
            {
              name: 'integration',
              description: 'Tests that verify the interaction between multiple units of code or components.'
            }
          ]
        }
      })
    ]
  },
  resolve: {}
})
