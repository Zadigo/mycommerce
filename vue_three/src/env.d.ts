/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_I18N_LOCALE: string
    readonly VITE_FALLBACK_I18N_LOCALE: string
    readonly VITE_BASE_URL: string
    readonly VITE_API_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
