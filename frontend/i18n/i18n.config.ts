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
            },
            unit: {
                style: 'unit',
                unit: 'centimeter',
                unitDisplay: 'short'
            }
        },
        es: {
            currency: {
                style: 'currency',
                currency: 'EUR',
                currencyDisplay: 'symbol'
            },
            unit: {
                style: 'unit',
                unit: 'centimeter',
                unitDisplay: 'short'
            }
        },
        en: {
            currency: {
                style: 'currency',
                currency: 'USD',
                currencyDisplay: 'symbol'
            },
            unit: {
                style: 'unit',
                unit: 'foot',
                unitDisplay: 'short'
            }
        }
    }
}))
