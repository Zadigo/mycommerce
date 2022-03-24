import { toInteger, toNumber } from 'lodash'

import reviews from '../../data/reviews.json'

var _ = require('lodash')

var shopModule = {
    state: () => ({
        cachedResponse: [],
        products: [],
        currentProduct: {},
        currentProductReviews: reviews,

        previousUrl: null,
        nextUrl: null,

        searchedPrice: [],
        
        // TODO: viewingHistory
        recentlyViewed: [],

        userLists: []
    }),

    mutations: {
        setProducts (state, payload) {
            state.cachedResponse = payload
            state.products = payload.results
            state.previousUrl = payload.previous
            state.nextUrl = payload.next
        },

        resetProducts (state) {
            state.cachedResponse = []
            state.products = []
            state.previousUrl = null
            state.nextUrl = null
        },
        
        setCurrentProduct (state, product) {
            if (typeof product == 'number') {
                state.currentProduct = _.find(state.products, ['id', toNumber(product)])
            } else {
                state.currentProduct = product
            }
        },
        
        setCurrentProductReviews (state, reviews) {
            state.currentProductReviews = reviews
        },
        
        setSearchedPrices (state, values) {
            state.setSearchedPrices = values
        },

        setUserLists(state, payload) {
            state.userLists = payload
        },


        setRecentlyViewed(state, product) {
            var productId = null

            if (typeof product == 'number') {
                productId = _.find(state.products, ['id', product])['id']
            } else {
                productId = product.id
            }

            state.recentlyViewed.push(productId)
        }
    },
    
    getters: {
        getProduct (state) {
            return (productId) => {
                var id = toInteger(productId)
                return _.find(state.products, ['id', id])
            }
        },

        getPrices (state) {
            var prices = []
            _.forEach(state.products, (product) => {
                prices.push(_.toNumber(product.unit_price))
            })
            return prices
        },

        filteredByPrice (state, getters) {
            state
            getters
            // Return a set of productss based on the
            // price range
            // if (_.countBy(state.searchedPrices, 'length') == 0) {
            //     return getters.searchedProducts
            // }
            // return _.filter(getters.searchedProducts, (product) => {
            //     return state.searchedPrices.includes(_.toNumber(product.unit_price))
            // })
            return []
        },

        minPrice (rootGetters) {
            return _.min(rootGetters['getPrices'])
        },
        maxPrice (rootGetters) {
            return _.max(rootGetters['getPrices'])
        },

        recentlyViewedProducts(state) {
            var uniqueItems = _.uniq(state.recentlyViewed)
            
            return _.filter(state.products, (product) => {
                return uniqueItems.includes(product.id)
            })
        },

        totalCount(state) {
            try {
                return state.cachedResponse.infos.total_count
            } catch {
                return 0
            }
        },

        nextUrl(state) {
            // Returns the url to use to load
            // more products
            if (state.cachedResponse.next) {
                var url = new URL(state.cachedResponse.next)
                return url
            } else {
                return null
            }
        },

        hasProducts(state) {
            return state.products.length > 0
        },

        recommendedProducts(state) {
            // Show the users additional products
            // that could interest them and that
            // are possibly in the same category
            // as the one of the page
            if (state.currentProduct) {
                var products = _.filter(state.products, (product) => {
                    return product.id != state.currentProduct.id
                })
                _.shuffle(products)
                // return _.slice(products, 0, 4)
                return _.sampleSize(products, 4)
            } else {
                return []
            }
        }
    }
}

export default shopModule
