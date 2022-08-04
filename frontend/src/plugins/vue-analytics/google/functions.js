/*

    REFERENCE GUIDES:
        - https://developers.google.com/analytics/devguides/collection/ga4/reference/events

*/

const DEFAULT_CURRENCY = 'EUR'

const DEFAULT_BRAND = null

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

/**
 * Ensure that the data that is received
 * is somewhat normalized for Google Analytics
 * 
 * @param {Object} item - Incoming item
 */
function checkItemFields (item) {
    if (typeof item !== 'object') {
        throw new Error('Item is not an object')
    }

    const fields = Object.keys(item)
    const cleanedItem = {}

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

/**
 * Ensures that the data that is received
 * is somewhat normalized for Google Analytics
 * 
 * @param {Array} item - List of items
 * @return Clean list of items
 */
function cleanItems (items) {
    var container = []

    items.forEach((item, i) => {
        var cleanedItem = checkItemFields(item)

        cleanedItem.index = i
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

    /**
     * Resets the datalayer container
     */
    reset () {
        window.dataLayer.push({ ecommerce: null })
    },
    
    /**
     * Creates a login signal
     * 
     * @param {String} method - 
     */
    login (method) {
        window.dataLayer.push({
            event: 'login',
            method: method
        })
    },

    /**
     * Creates a signup signal
     * 
     * @param {String} method - 
     */
    signup (method) {
        window.dataLayer.push({
            event: 'sign_up',
            method: method
        })
    },

    /**
     * Creates a signal for when a content
     * is shared from the website
     * 
     * @param {String} method - 
     * @param {String} contentType - 
     * @param {String|Number} itemId - 
     */
    share (method, contentType, itemId) {
        window.dataLayer.push({
            event: 'share',
            method: method,
            content_type: contentType,
            item_id: itemId
        })
    },

    /**
     * Creates a signal for when the page
     * was vieweed
     * 
     * @param {String} path - 
     * @param {String} title - 
     */
    pageView (path, title) {
        window.dataLayer.push({
            event: 'pageview',
            page: {
                path: path,
                title: title
            }
        })
    },

    /**
     * Creates a signal for when a search is
     * completed on the website
     * 
     * @param {String} searchTerm - 
     */
    search (searchTerm) {
        window.dataLayer.push({
            event: 'search',
            search_term: searchTerm
        })
    },

    /**
     * Used to create a custom event
     * 
     * @param {String} event - 
     * @param {String} eventCategory - 
     * @param {String} payload - 
     */
    createEvent (event, eventCategory, payload) {
        window.dataLayer.push({
            event: event,
            event_category: eventCategory,
            ...payload
        })
    },

    /**
     * Generates a view for when the
     * user see's an item
     * 
     * @param {String} item - 
     * @param {String} listName - 
     * @param {String|Number} listId - 
     */
    selectItem (item, listName, listId) {
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
                // currency: DEFAULT_CURRENCY
            }
        })
    },

    /**
     * Generates a view for when the
     * user see's an item
     * 
     * @param {String} item - 
     * @param {String} listName - 
     * @param {String|Number} listId - 
     */
    viewItem (item, listName, listId) {
        window.dataLayer.push({
            event: 'view_item',
            ecommerce: {
                items: [checkItemFields(item)],
                item_list_name: listName,
                item_list_id: listId
                // currency: DEFAULT_CURRENCY
            }
        })
    },

    /**
     * Event for multiple products
     * 
     * @param {Array} items - List of products
     * @param {Object} currentItem - Current product
     */
    viewItems (items, currentItem) {
        window.dataLayer.push({
            event: 'view_item_list',
            ecommerce: {
                items: cleanItems(items)
                // currency: DEFAULT_CURRENCY
            }
        })

        if (Object.keys(currentItem).length > 0) {
            this.viewItem(currentItem)
        }
    },

    /**
    * Event for visiting the cart page
    * 
    * @param {Array} items - List of products
    */
    viewCart (items) {
        window.dataLayer.push({
            event: 'view_cart',
            ecommerce: {
                items: cleanItems(items)
                // currency: DEFAULT_CURRENCY
            }
        })
    },

    /**
    * Event for viewing a promotion
    * 
    * @param {String|Number} promotionId - The promotion's ID 
    * @param {String} promotionName - The name of the promotion
    * @param {String} creativeSlot - 
    * @param {String} locationId - The location of the promotion on the page
    */
    viewPromotion (promotionId, promotionName, creativeSlot, locationId) {
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

    /**
     * Event for clicking on a promotion
     * 
     * @param {String|Number} promotionId - The promotion's ID 
     * @param {String} promotionName - The name of the promotion
     * @param {String} creativeSlot - 
     * @param {String} locationId - The location of the promotion on the page
    */
    selectPromotion (promotionId, promotionName, creativeSlot, locationId) {
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

    /**
     * Event for when the user select's an
     * element of somekind on the page
     * 
     * @param {String} contentType - The element's content type
     * @param {String|Number} itemId - The element's ID
    */
    selectContent (contentType, itemId) {
        window.dataLayer.push({
            event: 'select_content',
            content_type: contentType,
            item_id: itemId
        })
    },

    /**
     * Trigger for when the user adds an item
     * to the cart
     * 
     * @param {Object} contentType - Product
     * @param {String|Number} value - The total value of the cart
    */
    addToCart (item, value) {
        window.dataLayer.push({
            event: 'add_to_cart',
            ecommerce: {
                value: value,
                items: [checkItemFields(item)]
            }
        })
    },

    /**
     * Trigger for when the user removes an item
     * from the cart
     * 
     * @param {Object} item - Product
     * @param {String|Number} value - The total value of the cart
    */
    removeFromCart (item, value) {
        window.dataLayer.push({
            event: 'remove_from_cart',
            ecommerce: {
                currency: DEFAULT_CURRENCY,
                value: value,
                items: [checkItemFields(item)]
            }
        })
    },

    /**
     * Trigger for when the user adds an item
     * to his wishlist
     * 
     * @param {Object} contentType - Products
     * @param {String|Number} value - The total value of the wishlist
    */
    addToWishlist (item, value) {
        window.dataLayer.push({
            event: 'add_to_wishlist',
            ecommerce: {
                value: value,
                items: [checkItemFields(item)]
            }
        })
    },

    /**
     * Event for checkout begin
     * 
     * @param {Array} items - Products
     * @param {String|Number} value - The total value of the cart
    */
    beginCheckout (items, value) {
        this.reset()
        window.dataLayer.push({
            event: 'begin_checkout',
            ecommerce: {
                value: value,
                items: cleanItems(items)
            }
        })
    },

    /**
     * Event for clearing a cart
     * 
     * @param {Array} items - Products
     * @param {String|Number} value - The total value of the cart
    */
    clearCart (items, value) {
        window.dataLayer.push({
            event: 'remove_from_cart',
            ecommerce: {
                value: value,
                items: cleanItems(items)
            }
        })
    },

    /**
     * Event for adding shipping infos
     * 
     * @param {Array} items - Products
     * @param {String|Number} value - The total value of the cart
    */
    addShippingInfo (items, value) {
        window.dataLayer.push({
            event: 'add_shipping_info',
            ecommerce: {
                value: value,
                items: cleanItems(items)
            }
        });
    },

    /**
     * Event for adding billing infos
     * 
     * @param {Array} items - Products
     * @param {String|Number} value - The total value of the cart
    */
    addBillingInfo (items, value) {
        window.dataLayer.push({
            event: 'add_payment_info',
            ecommerce: {
                value: value,
                items: cleanItems(items)
            }
        })
    },

    /**
     * Event for purchasing a product
     * 
     * @param {Array} items - Products
     * @param {String|Number} value - The total value of the cart
     * @param {String} transactionId - The ID of the transaction
    */
    purchase (items, value, transactionId) {
        window.dataLayer.push({
            event: 'purchase',
            ecommerce: {
                // transaction_id: 'e29be662-4e6b-4f6d-8707-16921ec814c2',
                transaction_id: transactionId,
                tax: 5,
                shipping: 5,
                value: value,
                items: cleanItems(items)
            }
        })
    },

    /**
     * Event for reaching the success page
     * 
     * @param {Array} items - Products
     * @param {String|Number} value - The total value of the cart
    */
    successPage (items, value) {
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

    /**
     * Measure page timing
     * 
     * @param {Array} items - Products
     * @param {String|Number} value - The total value of the cart
    */
    measureTiming (eventCategory) {
        var timeSincePageLoad = Math.round(performance.now())
        window.dataLayer.push({
            event: 'timing_complete',
            name: 'load',
            value: timeSincePageLoad,
            event_category: eventCategory
        })
    },

    /**
     * Event for creating and exception
     * 
     * @param {String} description - Description of the exception
     * @param {String} fatal - The number of the exception
    */
    exception (description, fatal) {
        window.dataLayer.push({
            event: 'exception',
            description: description,
            fatal: fatal
        })
    }
}


