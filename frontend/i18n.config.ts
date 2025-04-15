export default defineI18nConfig(() => ({
    // legacy: false,
    // locale: 'fr',
    // fallbackLocale: 'en',
    strategy: "prefix_except_default",
    pages: {

    },
    numberFormats: {
        fr: {
            currency: {
                style: 'currency',
                currency: 'EUR',
                currencyDisplay: 'symbol'
            }   
        },
        es: {
            currency: {
                style: 'currency',
                currency: 'EUR',
                currencyDisplay: 'symbol'
            }
        },
        en: {
            currency: {
                style: 'currency',
                currency: 'USD',
                currencyDisplay: 'symbol'
            }
        }
    }
}))
