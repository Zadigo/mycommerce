import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
    test: {
        globals: true,
        environment: 'happy-dom',
        setupFiles: './tests/setupTests.ts',
        env: {
            DJANGO_DEV_URL: "127.0.0.1:8000"
        }
    }
})
