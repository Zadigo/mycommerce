/*

    REFERENCE GUIDES:
        - https://developers.google.com/analytics/devguides/collection/ga4/reference/events

*/

var DEFAULT_CURRENCY = 'EUR'

var DEFAULT_BRAND = null

const DEFAULT_DIMENSIONS = [
    'affiliation',
    'coupon',
    'currency',
    'discount',
    'index',
    'item_id',
    'item_brand',
    'item_category',
    'item_category_2',
    'item_category_3',
    'item_category_4',
    'item_category_5',
    'item_location_id',
    'item_list_id',
    'item_list_name',
    'item_name',
    'item_variant',
    'price',
    'quantity'
]

function checkItemFields(item) {
    // Ensure that the data that is received
    // is somewhat normalized for Google Analytics

    if (typeof item != 'object') {
        throw new Error('Item is not an object')
    }

    var fields = Object.keys(item)
    var cleanedItem = {}

    // var regex = /^item_category_\d+$/g

    fields.forEach((field) => {
        if (DEFAULT_DIMENSIONS.includes(field)) {
            cleanedItem[field] = item[field]
        } else {
            console.warn(`${field} is not a valid dimension for Google Analytics`)
        }

    })

    return cleanedItem
}

function cleanItems(items) {
    var container = []

    items.forEach((item, i) => {
        var cleanedItem = checkItemFields(item)

        cleanedItem['index'] = i
        container.push(cleanedItem)
    })
    return container
}

export default {
    DEFAULT_CURRENCY,
    DEFAULT_BRAND,
    DEFAULT_DIMENSIONS,

    // createProduct (id, name, price, category, discount, coupon, index) {
    //     return {
    //         coupon: coupon,
    //         discount: discount,
    //         item_brand: DEFAULT_BRAND,
    //         item_category: category,
    //         item_id: id,
    //         item_name: name,
    //         index: index,
    //         price: price
    //     }
    // },

    reset() {
        window.dataLayer.push({ ecommerce: null })
    },

    login(method) {
        window.dataLayer.push({
            event: 'login',
            method: method
        })
    },

    signup(method) {
        window.dataLayer.push({
            event: 'sign_up',
            method: method
        })
    },

    share(method, contentType, itemId) {
        window.dataLayer.push({
            event: 'share',
            method: method,
            content_type: contentType,
            item_id: itemId
        })
    },

    pageView(path, title) {
        // Generates a page view
        window.dataLayer.push({
            event: 'pageview',
            page: {
                path: path,
                title: title
            }
        })
    },

    search(searchTerm) {
        window.dataLayer.push({
            event: 'search',
            search_term: searchTerm
        })
    },

    createEvent(event, eventCategory, payload) {
        // Creates a custom event
        window.dataLayer.push({
            event: event,
            event_category: eventCategory,
            ...payload
        })
    },

    selectItem(item, listName, listId) {
        // Generates a view for when the
        // user see's an item
        // var cleanedItem = checkItemFields(item)
        this.reset()
        window.dataLayer.push({
            event: 'select_item',
            ecommerce: {
                // items: [
                //     {
                //         item_id: item.id,
                //         item_name: item.name,
                //         price: item.price,
                //         item_brand: DEFAULT_BRAND,
                //         item_category: item.category,
                //         index: index,
                //         discount: discount,
                //         coupon: coupon
                //     }
                // ],
                items: [checkItemFields(item)],
                // item_list_name: 'homepage',
                // item_list_id: 'some_id',
                item_list_name: listName,
                item_list_id: listId
            }
        })
    },

    viewItem(item, listName, listId) {
        // Generates a view for when the
        // user see's an item
        this.reset()
        window.dataLayer.push({
            event: 'view_item',
            ecommerce: {
                items: [checkItemFields(item)],
                item_list_name: listName,
                item_list_id: listId
            }
        })
    },

    viewItems(items, currentItem) {
        // Event for multiple products
        window.dataLayer.push({
            event: 'view_item_list',
            ecommerce: {
                items: cleanItems(items)
            }
        })

        if (currentItem) {
            this.viewItem(currentItem)
        }
    },

    viewCart(items) {
        window.dataLayer.push({
            event: 'view_cart',
            ecommerce: {
                items: cleanItems(items)
                // currency: DEFAULT_CURRENCY
            }
        })
    },

    viewPromotion(promotionId, promotionName, creativeSlot, locationId) {
        this.reset()
        window.dataLayer.push({
            event: 'view_promotion',
            ecommerce: {
                items: [
                    // {
                    //     promotion_id: "bts",
                    //     promotion_name: "Back To School",
                    //     creative_slot: "PRODUCT banner",
                    //     location_id: "right sidebar"
                    // }
                    {
                        promotion_id: promotionId,
                        promotion_name: promotionName,
                        creative_slot: creativeSlot,
                        location_id: locationId
                    }
                ]
            }
        })
    },

    selectPromotion(promotionId, promotionName, creativeSlot, locationId) {
        // Event for when a promotion is selected
        window.dataLayer.push({
            event: 'select_promotion',
            ecommerce: {
                promotions: [{
                    // promotion_id: 'bts',
                    // promotion_name: 'Back To School',
                    // creative_slot: 'HOME banner',
                    // location_id: 'right sidebar'
                    promotion_id: promotionId,
                    promotion_name: promotionName,
                    creative_slot: creativeSlot,
                    location_id: locationId
                }]
            }
        })
    },

    selectContent(contentType, itemId,) {
        // Event for when the user select's an
        // element of somekind on the page
        window.dataLayer.push({
            event: 'select_content',
            content_type: contentType,
            item_id: itemId
        })
    },

    addToCart(item, value) {
        // Trigger for when the user adds an item
        // to the cart
        this.reset()
        window.dataLayer.push({
            event: 'add_to_cart',
            ecommerce: {
                value: value,
                items: [checkItemFields(item)]
            }
        })
    },

    addToWishlist(item, value) {
        // Trigger for when the user adds an item
        // to his wishlist
        window.dataLayer.push({
            event: 'add_to_cart',
            ecommerce: {
                // currency: DEFAULT_CURRENCY,
                value: value,
                items: [checkItemFields(item)]
            }
        })
    },

    removeFromCart(item, value) {
        window.dataLayer.push({
            event: 'remove_from_cart',
            ecommerce: {
                currency: DEFAULT_CURRENCY,
                value: value,
                items: [checkItemFields(item)]
            }
        })
    },

    beginCheckout(items, value) {
        // Event for checkout begin
        this.reset()
        window.dataLayer.push({
            event: 'begin_checkout',
            ecommerce: {
                value: value,
                // currency: DEFAULT_CURRENCY,
                items: cleanItems(items)
            }
        })
    },

    clearCart(items, value) {
        // Event for clearing a cart
        window.dataLayer.push({
            event: 'remove_from_cart',
            ecommerce: {
                value: value,
                // currency: DEFAULT_CURRENCY,
                items: cleanItems(items)
            }
        })
    },

    addShippingInfo(items, value) {
        // Event for adding shipping infos
        window.dataLayer.push({
            event: 'add_shipping_info',
            ecommerce: {
                value: value,
                // currency: DEFAULT_CURRENCY,
                items: cleanItems(items)
            }
        });
    },

    addBillingInfo(items, value) {
        // Event for adding billing infos
        window.dataLayer.push({
            event: 'add_payment_info',
            ecommerce: {
                value: value,
                // currency: DEFAULT_CURRENCY,
                items: cleanItems(items)
            }
        })
    },

    purchase(items, value, transactionId) {
        // Event for purchasing a product
        window.dataLayer.push({
            event: 'purchase',
            ecommerce: {
                // transaction_id: 'e29be662-4e6b-4f6d-8707-16921ec814c2',
                transaction_id: transactionId,
                // currency: DEFAULT_CURRENCY,
                tax: 5,
                shipping: 5,
                value: value,
                items: cleanItems(items)
            }
        })
    },

    successPage(items, value) {
        // A trigger for whn the user
        // has reached the success page
        window.dataLayer.push({
            event: 'purchase_success',
            ecommerce: {
                value: value,
                items: cleanItems(items)
            }
        })
    },

    measureTiming(eventCategory) {
        var timeSincePageLoad = Math.round(performance.now())
        window.dataLayer.push({
            event: 'timing_complete',
            name: 'load',
            value: timeSincePageLoad,
            event_category: eventCategory
        })
    },

    exception(description, fatal) {
        window.dataLayer.push({
            event: 'exception',
            description: description,
            fatal: fatal
        })
    }
}


