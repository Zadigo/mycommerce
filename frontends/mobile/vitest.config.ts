import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import { defineVitestProject } from '@nuxt/test-utils/config'

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: [ 'text', 'json', 'html' ]
    },
    env: {
      NODE_ENV: 'test'
    },
    browser: {
      enabled: true,
      provider: playwright(),
      // https://vitest.dev/config/browser/playwright
      instances: [
      ]
    },
    projects: [
      await defineVitestProject({
        test: {
          name: 'unit',
          include: [ 'test/{e2e,unit}/*.{test,spec}.ts' ],
          environment: 'node',
          testTimeout: 20000
        }
      }),
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: [ 'test/nuxt/*.{test,spec}.ts' ],
          environment: 'nuxt',
          testTimeout: 20000
        }
      })
    ]
  }
})
