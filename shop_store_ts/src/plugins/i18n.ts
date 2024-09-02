import { createI18n } from 'vue-i18n'

import en from '../locales/en-US.json'
import es from '../locales/es-ES.json'
import fr from '../locales/fr-FR.json'

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

export default createI18n({
  legacy: false,
  locale: 'fr-FR',
  fallbackLocale: 'en-US',
  globalInjection: true,
  numberFormats,
  messages: {
    en,
    es,
    fr
  }
})
