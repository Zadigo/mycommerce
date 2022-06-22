import { createI18n } from 'vue-i18n'

function loadLocaleMessages () {
  const messages = {}
  // const locales = require.context('./', true, /[A-Za-z0-9-_,\s]+\.json$/i)

  // locales.keys().forEach(key => {
  //   const matched = key.match(/([A-Za-z0-9-_]+)\./i)
  //   if (matched && matched.length > 1) {
  //     const locale = matched[1]
  //     messages[locale] = locales(key)
  //   }
  // })

  return messages
}

const numberFormats = {
  en: {
    currency: {
      style: 'currency',
      currency: 'USD',
      currencyDisplay: 'symbol'
    }
  },
  fr: {
    currency: {
      style: 'currency',
      currency: 'EUR',
      currencyDisplay: 'symbol'
    }
  }
}

const i18n = createI18n({
  locale: import.meta.env.VITE_I18N_LOCALE || 'en',
  fallbackLocale: import.meta.env.VITE_FALLBACK_I18N_LOCALE || 'en',
  messages: loadLocaleMessages(),
  numberFormats
})

if (import.meta.env.DEV) {
  window.translate = i18n
}

export default i18n
