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
            var index = _.findIndex(state.products, ['id', updatedProduct.id])
            state.products[index] = updatedProduct
        }
    },

    actions: {
        updateProduct ({ commit }, updatedProduct) {
            commit('setUpdatedProduct', updatedProduct)
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
