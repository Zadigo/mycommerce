var _ = require('lodash')

var dashboardModule = {
    namespaced: true,
    
    state: () => ({
        products: [],
        productDetails: {},
        productImages: []
    }),

    mutations: {
        setProducts (state, paylaod) {
            state.products = paylaod
        },

        setProductDetails (state, id) {
            state.productDetails = _.find(state.products, ['id', id])
        },

        setUpdatedProduct(state, updatedProduct) {
            // Find the index of the old element to update
            // and replace it with the newer one
            // TODO: Maybe it's not necessary to update the product
            // on the index since certain pages will reupload the
            // whole products from the database
            // var index = _.findIndex(state.products, ['id', updatedProduct.id])
            // state.products[index] = updatedProduct
            state.productDetails = updatedProduct
        }
    },

    actions: {
        updateProduct ({ commit }, updatedProduct) {
            commit('setUpdatedProduct', updatedProduct)
        },

        selectiveProductUpdates({ state, commit }, items) {
            // Based on a subset of items, update
            // them in the in the current list
            var updatedItems = state.products.map((product) => {
                items.forEach((item) => {
                    if (product.id == item.id) {
                        product = Object.assign(product, item)
                    }
                })
                return product
            })
            commit('setProducts', updatedItems)
        }
    },

    getters: {
        getProduct (state) {
            return (id) => {
                return _.find(state.products, ['id', id])
            }
        }
    }
}

export default dashboardModule
