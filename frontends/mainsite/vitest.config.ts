import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    },
    env: {
      NODE_ENV: 'test'
    },
    projects: [
      await defineVitestProject({
        test: {
          name: 'unit',
          include: ['test/{e2e,unit}/*.{test,spec}.ts'],
          environment: 'node',
          testTimeout: 20000,
          tags: [
            {
              name: 'e2e',
            }
          ]
        }
      }),
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: ['test/nuxt/*.{test,spec}.ts'],
          environment: 'nuxt',
          testTimeout: 20000,
          tags: [
            {
              name: 'nuxt',
            }
          ]
        }
      }),
      await defineVitestProject({
        test: {
          name: 'integration',
          include: [ 'test/integration/*.{test,spec}.ts' ],
          environment: 'node',
          testTimeout: 20000,
          tags: [
            {
              name: 'integration',
            }
          ]
        }
      })
    ]
  },
  resolve: {}
})
