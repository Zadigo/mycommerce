
var DEFAULT_CURRENCY = 'EUR'

export default {
    DEFAULT_CURRENCY,
    
    pageView(path, title) {
        // Manual trigger for generating
        // a page view
        window.dataLayer.push({
            event: 'pageview',
            page: {
                path: path,
                title: title
            }
        })
    },

    createEvent(event, payload) {
        // Crete a custom event
        window.dataLayer.push({
            event: event,
            ...payload
        })
    },

    viewProduct(product) {
        // A trigger for when the user clicks
        // on a given product
        window.dataLayer.push({
            event: 'select_item',
            ecommerce: {
                items: [{
                    item_id: 'b55da',
                    item_name: product.name,
                    price: product.unit_price,
                    item_brand: 'Example Brand',
                    item_category: 'T-Shirts',
                    index: 3
                }],
                item_list_name: 'homepage',
                item_list_id: 'homepage',
                currency: DEFAULT_CURRENCY
            }
        })
    },

    viewProducts(products, currentProduct) {
        // A trigger for when the user watches a page
        // composed of multiple products
        var items = []

        // TODO: Find a way to make th product list
        // available for the next view

        products.forEach((product, i) => {
            items.push({
                item_id: product.id,
                item_name: product.name,
                price: product.unit_price,
                item_brand: null,
                item_category: 'T-Shirts',
                index: i
            })
        })

        window.dataLayer.push({
            event: 'view_item_list',
            ecommerce: {
                items: items,
                currency: DEFAULT_CURRENCY
            }
        })

        window.dataLayer.push({
            event: 'view_item',
            ecommerce: {
                items: [{
                    item_id: currentProduct.id,
                    item_name: currentProduct.name,
                    price: currentProduct.unit_price,
                    item_brand: null,
                    item_category: 'T-Shirts',
                    index: 0
                }],
                currency: 'EUR'
            }
        })

        // dataLayer.push({
        //     "event": "view_promotion",
        //     "ecommerce": {
        //         "items": [{
        //             "promotion_id": "bts",
        //             "promotion_name": "Back To School",
        //             "creative_slot": "PRODUCT banner",
        //             "location_id": "right sidebar"
        //         }]
        //     }
        // })
    },

    addToCart(product) {
        // Trigger for when the user adds an item
        // to the cart
        return window.dataLayer.push({
            event: 'add_to_cart',
            ecommerce: {
                currency: DEFAULT_CURRENCY,
                value: 16,
                items: [{
                    item_id: 'b55da',
                    item_name: product.name,
                    price: product.unit_price,
                    quantity: 1,
                    item_brand: 'Flexigen',
                    item_category: 'T-Shirts',
                    item_variant: 'red',
                    index: 0,
                    size: 'M'
                }]
            }
        })
    },

    removeFromCart(product) {
        return window.dataLayer.push({
            event: 'remove_from_cart',
            ecommerce: {
                currency: DEFAULT_CURRENCY,
                value: 16,
                items: [{
                    item_id: 'b55da',
                    item_name: product.name,
                    price: product.unit_price,
                    quantity: 1,
                    item_brand: 'Flexigen',
                    item_category: 'T-Shirts',
                    item_variant: 'red',
                    index: 0,
                    size: 'M'
                }]
            }
        })
    },

    beginCheckout(products) {
        // A trigger for when the user begins
        // the checkout process
        window.dataLayer.push({
            event: 'begin_checkout',
            ecommerce: {
                value: 0,
                currency: DEFAULT_CURRENCY,
                items: products
            }
        })
    },

    clearCart(products) {
        // A trigger for when th user clears
        // the cart completely
        window.dataLayer.push({
            event: 'remove_from_cart',
            ecommerce: {
                value: 0,
                currency: DEFAULT_CURRENCY,
                items: products
            }
        })
    },

    addShippingInfo(products) {
        // A trigger for when the user adds shipping
        // information
        window.dataLayer.push({
            event: 'add_shipping_info',
            ecommerce: {
                value: 0,
                currency: DEFAULT_CURRENCY,
                items: products
            }
        });
    },

    addBillingInfo(products) {
        // A trigger for when the user adds
        // billing information
        window.dataLayer.push({
            event: 'add_payment_info',
            ecommerce: {
                value: 0,
                currency: DEFAULT_CURRENCY,
                items: products
            }
        })
    },

    purchase(products) {
        // A trigger for when the user
        // purchases the products
        window.dataLayer.push({
            event: 'purchase',
            ecommerce: {
                transaction_id: 'e29be662-4e6b-4f6d-8707-16921ec814c2',
                currency: DEFAULT_CURRENCY,
                tax: 5,
                shipping: 5,
                value: 10,
                items: products
            }
        })
    },

    successPage(payload) {
        // A trigger for whn the user
        // has reached the success page
        window.dataLayer.push({
            event: 'purchase_success',
            ecommerce: payload
        })
    },

    selectPromotion(payload) {
        // Trigger for when the user clicks on
        // a given promotion on the page
        payload
        window.dataLayer.push({
            event: 'select_promotion',
            ecommerce: {
                promotions: [{
                    promotion_id: 'bts',
                    promotion_name: 'Back To School',
                    creative_slot: 'HOME banner',
                    location_id: 'right sidebar'
                }]
            }
        })
    }
}


