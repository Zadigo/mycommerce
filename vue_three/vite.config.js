import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const path = require('path')
import eslint from 'vite-plugin-eslint'

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
    outDir: path.resolve(__dirname, 'static'),
    assetsDir: ''
    // rollupOptions: {
    //   input: {
    //     main: path.resolve(__dirname, '../../static'),
    //   }
    // }
  },
  resolve: {
    alias: {
      'vue-i18n': 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js',
      '@': path.resolve(__dirname, 'src'),
      '@/utils': path.resolve(__dirname, 'src/utils.js')
    }
  }
})
