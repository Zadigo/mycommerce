/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEVELOPMENT_URL: string;
  readonly VITE_PRODUCTION_URL: string;
  readonly VITE_DEVELOPMENT_API_URL: string;
  readonly VITE_PRODUCTION_API_URL: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
  readonly VITE_STRIPE_ACCOUNT: string;
  readonly VITE_STRIPE_API_VERSION: string;
  readonly VITE_STRIPE_LOCALE: string;
  readonly VITE_DEVELOPMENT_SIGNUP_URL: string;
  readonly VITE_DEVELOPMENT_QUART_API_URL: string;
  readonly VITE_PRODUCTION_QUART_API_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
