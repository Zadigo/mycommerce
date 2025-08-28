import path from 'path'

import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'

export default defineConfig({
  test: {
    setupFiles: ['./tests/vitest.setup.ts'],
    projects: [
      await defineVitestProject({
        test: {
          name: 'unit',
          include: ['tests/unit/*.{test,spec}.ts'],
          environment: 'nuxt',
          testTimeout: 20000,
          globals: true

        }
      }),
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: ['tests/nuxt/**/*.{test,spec}.ts'],
          environment: 'nuxt',
          testTimeout: 20000,
          globals: true

        }
      })
    ]
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './app'),
      '@': path.resolve(__dirname, './app'),
      '#app': path.resolve(__dirname, './node_modules/nuxt/dist/app'),
      'firebase/firestore': path.resolve(__dirname, 'tests/__mocks__/firebase/firestore.ts'),
      'firebase/app': path.resolve(__dirname, 'tests/__mocks__/firebase/app.ts'),
      'firebase/database': path.resolve(__dirname, 'tests/__mocks__/firebase/database.ts')
    }
  }
})
