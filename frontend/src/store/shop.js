import _ from 'lodash'
import { defineStore } from 'pinia'
import { useAuthentication } from './authentication'

// const useCart = defineStore('cart', {
//     state: () => ({
//         cart: []
//     })
// })

const useShop = defineStore('shop', {
    state: () => ({
        cachedCartResponse: {},
        cartSessionId: null,
        cartItems: [],
        cart: [],
        
        openCart: false,
        showSearchModal: false,
        showSubscriptionModal: false,
        
        likedProducts: [],
        recentlyViewed: [],
        
        originalProductsResponse: {},
        products: [],
        currentProduct: {},
        currentProductReviews: [],

        previousUrl: null,
        nextUrl: null,

        searchedPrice: [],

        userLists: []
    }),
    actions: {
        logout() {
            var store = useAuthentication()
            store.logout()
        },
        resetProducts() {
            
        },
        updateCart(data) {
            if (data) {
                this.cachedCartResponse = data
                this.cartSessionId = data.session_id
                this.cartItems = data.results
                this.cart = data.statistics
            } else {
                this.cart = []
            }
        }
    },
    getters: {
        cartLength() {
            return this.cart.length
        },
        minPrice() {
            return _.minBy(this.products, 'get_price')
        },
        maxPrice() {
            return _.maxBy(this.products, 'get_price')
        },
        hasProducts() {
            return this.products.length > 0
        },
        displayedProductsCount() {
            return this.products.length
        }
    }
})

export {
    useShop
}
