/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

import vue from '@vitejs/plugin-vue'
import UnheadVite from '@unhead/addons/vite'
import eslint from 'vite-plugin-eslint'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

export default defineConfig(({ mode }) => {
  const root = process.cwd()
  const env = loadEnv(mode, root)
  process.env = { ...process.env, ...env }

  return {
    root,
    resolve: {
      extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json', '.vue'],
      alias: {
        '@': resolve(__dirname, './src'),
        'src': resolve(__dirname, './src'),
        'components': resolve(__dirname, './src/components'),
        'layouts': resolve(__dirname, './src/layouts'),
        'pages': resolve(__dirname, './src/pages'),
        'stores': resolve(__dirname, './src/stores'),
        'data': resolve(__dirname, './src/data'),
        'composables': resolve(__dirname, './src/composables'),
        'assets': resolve(__dirname, './src/assets')
      }
    },
    plugins: [
      vue(),
      UnheadVite(),
      eslint({
        lintOnStart: true
      }),
      VueI18nPlugin({
        include: resolve(dirname(fileURLToPath(import.meta.url), './src/locales/**')),
        fullInstall: false,
        compositionOnly: true,
      })
    ],
    test: {
      alias: {
        // '@/': new URL('./src/', import.meta.url).pathname,
        // 'src': resolve(__dirname, './src'),
      },
      browser: {
        enabled: true,
        name: 'chrome'
      }
    }
  }
})
