/**
 * Implements functionnalities for components
 * and views that require working with products
 * in the backend
 * 
 */

export default function useShopComposable() {
    async function requestProductVariants() {
        try {
            var response = await this.axios.post(`/shop/products/${this.currentProduct.id}`)

            this.productVariants = response.data['variants']
            this.reviews = response.data['reviews']

            // TODO: If the recommended products is below 1, maybe propose
            // and alternative set of items to the user
            this.recommendedProducts = response.data['recommended_products']

            this.isLoading = false
            // setTimeout(() => {
            // }, 1000)
        } catch(error) {
            this.store.addErrorMessage('Could not get the current product')
        }
    }

    /**
     * Request products from a given
     * collection
     * 
     */
    async function productsRequest() {
        try {
            // Sends a request to get the backend
            // without sending an emit
            var collectionName = this.$route.params.collection
            var response = null

            if (collectionName == 'all') {
                response = await this.axios.get('/collection/all')
            } else {
                // FIXME: When reloading thee product page
                // the collectionName is undefineed making the
                // product page not being able to retrieve the
                // variants
                response = await this.axios.get(`/collection/${collectionName}`)
            }

            this.store.$patch((state) => {
                state.originalProductsResponse = response.data
                state.products = state.originalProductsResponse.results
                this.$localstorage.create('products', state.products)
                // this.$session.create('products', response.data)
            })
        } catch(error) {
            this.store.addErrorMessage('An error occured')
        }
    }

    function getProducts() {
        this.$emit('start-load')
        this.productsRequest()
        this.$emit('end-load')
    }

    return {
        productsRequest,
        requestProductVariants,
        getProducts
    }
}
