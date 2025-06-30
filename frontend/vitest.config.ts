import { defineConfig } from 'vitest/config'
import path from 'path'
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    // environment: 'nuxt',
    testTimeout: 1000,
    setupFiles: [
      './tests/vitest.setup.ts'
    ],
    coverage: {
      enabled: true
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'nuxt-pages',
          include: ['**/*.{spec,test}.ts'],
          environment: 'nuxt'
        }
      }
    ]
  },
  resolve: {
    alias: {
      'firebase/firestore': path.resolve(__dirname, 'tests/__mocks__/firebase/firestore.ts'),
      'firebase/app': path.resolve(__dirname, 'tests/__mocks__/firebase/app.ts'),
      'firebase/database': path.resolve(__dirname, 'tests/__mocks__/firebase/database.ts')
    }
  }
})
