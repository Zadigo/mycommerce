// import { setupDevtools } from "../devtools"
import googleAnalyticsFunctions from './functions'

function createProduct(id, name, price, brand, category, index) {
    // Standard function for creating a product
    // standardized for analytics
    return {
        item_id: id,
        item_name: name,
        price: price,
        item_brand: brand,
        item_category: category,
        index: index
    }
}

function mapToFields(products, mapping) {
    // Map the fields from the incoming product
    // object to a standard analytics one
    return products.map((product) => {
        var entries = Object.entries(mapping)
        var newItems = {}

        entries.forEach((entry) => {
            newItems[entry[1]] = product[entry[0]]
        })

        return newItems
    })
}

function createGoogleAnalytics(tag, currency) {
    googleAnalyticsFunctions.DEFAULT_CURRENCY = currency || googleAnalyticsFunctions.DEFAULT_CURRENCY

    var noScript = document.createElement('script')
    var attr = document.createAttribute('src')
    attr.value = 'https://www.googletagmanager.com/gtag/js?id=G-TQ8RWETJ4Q'

    var attr2 = document.createAttribute('async')
    noScript.setAttributeNode(attr)
    noScript.setAttributeNode(attr2)

    var script = document.createElement('script')
    var content = document.createTextNode(`
    window.dataLayer = window.dataLayer || []
    function gtag() { dataLayer.push(arguments) }
    gtag('js', 1 * new Date())
    gtag('config', 'G-TQ8RWETJ4Q')`)
    script.appendChild(content)

    var head = document.getElementsByTagName('head')
    head[0].appendChild(noScript)
    // script.parentNode.insertBefore(noScript, script)
    head[0].appendChild(script)

    return {
        install: (Vue) => {
            Vue.mixin({
                data: () => ({
                    googleAnalytics: {
                        tag: tag,
                        dataLayer: window.dataLayer
                    }
                }),

                // beforeCreate() {
                //     if (this.$options.analyticsPlugin) {
                //         setupDevtools(this)
                //     }
                // }
            })

            Vue.prototype.$google_analytics = googleAnalyticsFunctions
        }
    }
}

export {
    createProduct,
    createGoogleAnalytics,
    mapToFields
}
