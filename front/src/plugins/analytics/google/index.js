// import { setupDevtools } from "../devtools"
import functions from './functions'

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

function createGoogleAnalytics(tag, options) {
    let { currency, brand } = options

    functions.DEFAULT_CURRENCY = currency ? currency : functions.DEFAULT_CURRENCY
    functions.DEFAULT_BRAND = brand

    var head = document.getElementsByTagName('head')[0]

    // Create the no script tag
    var noScript = document.createElement('script')
    var srcAttribute = document.createAttribute('src')
    var url = new URL('https://www.googletagmanager.com/gtag/js')

    url.searchParams.append('id', tag)
    srcAttribute.value = url.toString()

    var asyncAttribute = document.createAttribute('async')
    noScript.setAttributeNode(srcAttribute)
    noScript.setAttributeNode(asyncAttribute)

    // Create the main script tag
    var script = document.createElement('script')
    var content = document.createTextNode(`
    window.dataLayer = window.dataLayer || []
    function gtag() { dataLayer.push(arguments) }
    gtag('js', 1 * new Date())
    gtag('config', '${tag}', { currency: '${functions.DEFAULT_CURRENCY}' })`)

    script.appendChild(content)

    // additionalProperties.forEach((property) => {
    //     var textObject = document.createTextNode(`gtag('config', '${property}', { currency: '${functions.DEFAULT_CURRENCY}' })`)
    //     script.appendChild(textObject)
    // })

    // Mount the tags
    head.appendChild(script)
    script.parentNode.insertBefore(noScript, script)

    return {
        install: (Vue) => {
            Vue.mixin({
                data: () => ({
                    googleAnalytics: {
                        tag: tag,
                        dataLayer: window.dataLayer
                    }
                }),

                // mounted() {
                //     // Measures the loading performance
                //     // of the VueJS application
                //     if (window.performance) {
                //         functions.measureTiming('Application Mount')
                //     }
                // }
            })

            Vue.prototype.$analytics = {
                google: functions
            }

            window.VueAnalytics = functions
        }
    }
}

export {
    createProduct,
    createGoogleAnalytics,
    mapToFields,
    functions
}
