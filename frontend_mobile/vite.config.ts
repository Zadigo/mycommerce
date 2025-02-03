/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [
//     vue(),
//     legacy()
//   ],
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, './src'),
//     },
//   },
//   test: {
//     globals: true,
//     environment: 'jsdom'
//   }
// })

export default defineConfig(({ mode }) => {
  const root = process.cwd()
  const env = loadEnv(mode, root)
  process.env = { ...process.env, ...env }
  
  return {
    plugins: [
      vue(),
      legacy()
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    test: {
      globals: true,
      environment: 'jsdom'
    }
  }
})
