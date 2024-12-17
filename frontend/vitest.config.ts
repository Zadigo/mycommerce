import { defineVitestConfig } from '@nuxt/test-utils/config'

import vue from '@vitejs/plugin-vue'

export default defineVitestConfig({
    plugins: [vue()],
    test: {
        globals: true,
        environment: 'happy-dom',
        setupFiles: './tests/setupTests.ts',
        include: ['**/*.{test,spec}.{js,ts,vue}'],
        env: {
            DJANGO_DEV_URL: "127.0.0.1:8000"
        }
    }
})
