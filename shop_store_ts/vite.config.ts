/// <reference types="vitest" />

import { defineConfig, loadEnv } from "vite";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { VitePWA } from "vite-plugin-pwa";

import vue from "@vitejs/plugin-vue";
import UnheadVite from "@unhead/addons/vite";
import eslint from "vite-plugin-eslint";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const root = process.cwd();
  const env = loadEnv(mode, root);
  process.env = { ...process.env, ...env };

  return {
    root,
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
        src: resolve(__dirname, "./src"),
        components: resolve(__dirname, "./src/components"),
        layouts: resolve(__dirname, "./src/layouts"),
        pages: resolve(__dirname, "./src/pages"),
        stores: resolve(__dirname, "./src/stores"),
        plugins: resolve(__dirname, "./src/plugins"),
        data: resolve(__dirname, "./src/data"),
        composables: resolve(__dirname, "./src/composables"),
        assets: resolve(__dirname, "./src/assets"),
      },
    },
    plugins: [
      vue(),
      UnheadVite(),
      eslint({
        lintOnStart: true,
      }),
      VueI18nPlugin({
        include: resolve(
          dirname(fileURLToPath(import.meta.url), "./src/locales/**")
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
      browser: {
        enabled: true,
        name: "chrome",
      },
    },
  };
});
