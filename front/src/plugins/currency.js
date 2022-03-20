var CURRENCIES = {
    'en': 1.11,
    'us': 1.11,
    'fr': 6.55957
}

function multiply(a, b) {
    var value = a * 1
    return Math.round(value * b * 10) / 10
}

function divide(a, b) {
    var value = a * 1
    return Math.round(value / b * 10) / 10
}

function getCurrencyValue(currency, fallBack) {
    var currencyValue = CURRENCIES[currency]

    if (!currencyValue) {
        if (fallBack) {
            currencyValue = CURRENCIES[fallBack]
        } else {
            currencyValue = CURRENCIES['en']
        }
    }
}

function createCurrency(options) {
    let { currencies, fallBack } = options

    Object.assign(CURRENCIES, currencies)

    return {
        install(Vue) {
            Vue.prototype.$currency = {
                forward: (value, currency) => { return multiply(value, getCurrencyValue(currency, fallBack)) },
                backward: (value, currency) => { return divide(value, getCurrencyValue(currency, fallBack)) }
            }

            Vue.mixin({
                data: () => ({
                    currencies: CURRENCIES
                })
            })
        }
    }
}

export default createCurrency({
    currencies: {},
    fallBack: 'en'
})
