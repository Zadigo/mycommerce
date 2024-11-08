/// <reference types="vitest" />

import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { defineConfig, loadEnv } from "vite";
import { VitePWA } from "vite-plugin-pwa";

import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import UnheadVite from "@unhead/addons/vite";
import vue from "@vitejs/plugin-vue";
import eslint from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const root = process.cwd();
  const env = loadEnv(mode, root);
  process.env = { ...process.env, ...env };

  return {
    root,
    resolve: {
      alias: [
        {
          find: "@",
          replacement: resolve(__dirname, "src"),
        },
        {
          find: "src",
          replacement: resolve(__dirname, 'src')
        }
      ],
    },
    plugins: [
      vue(),
      UnheadVite(),
      eslint({
        lintOnStart: true,
      }),
      VueI18nPlugin({
        include: resolve(
          dirname(fileURLToPath(import.meta.url)),
          "./src/locales/**"
        ),
        fullInstall: false,
        compositionOnly: true,
      }),
      VitePWA({
        selfDestroying: false,
        includeAssets: [
          "favicon.icon",
          "apple-touch-icon.png",
          "mask-icon.svg",
        ],
        manifest: {
          name: "Boutique",
          short_name: "boutique",
          description: "My shop description",
          theme_color: "#ffffff",
          // To generate the images see:
          // https://www.pwabuilder.com/imageGenerator
          icons: [
            {
              src: "pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
        },
        registerType: "autoUpdate",
        devOptions: {
          enabled: true,
        },
      }),
    ],
    test: {
      globals: true,
      environment: 'jsdom',
      // browser: {
      //   name: 'chromium',
      //   enabled: true,
      //   provider: 'playwright'
      // }
    },
  };
});
