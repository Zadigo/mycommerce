import { defineConfig } from 'vite'

const path = require('path')

import vue from '@vitejs/plugin-vue'
import eslint from 'vite-plugin-eslint'
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    eslint()
  ],
  define: {
    'process.env': {}
  },
  build: {
    manifest: true,
    // outDir: '../static/dist',
    outDir: './dist',
    assetsDir: '',
    rollupOptions: {
      plugins: [
        dynamicImportVars()
      ],
      input: path.resolve(__dirname, './src/main.js'),
      output: {
        dir: path.resolve(__dirname, 'dist'),
        format: 'module',
        name: 'main'
      }
    }
  },
  resolve: {
    alias: {
      'vue-i18n': 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js',
      '@': path.resolve(__dirname, 'src'),
      '@/utils': path.resolve(__dirname, 'src/utils.js')
    }
  }
})
