export default defineI18nConfig(() => ({
    legacy: false,
    locale: 'fr-FR',
    fallbackLocale: 'en-US',
    numberFormats: {
        'fr-FR': {
            currency: {
                style: 'currency',
                currency: 'EUR',
                currencyDisplay: 'symbol'
            }
        },
        'es-ES': {
            currency: {
                style: 'currency',
                currency: 'EUR',
                currencyDisplay: 'symbol'
            }
        },
        'en-US': {
            currency: {
                style: 'currency',
                currency: 'USD',
                currencyDisplay: 'symbol'
            }
        }
    }
}))
