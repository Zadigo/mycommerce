/*
    Implements functionnalities for components
    and views that require working with products
    in the backend
*/ 

export default {
    methods: {
        async productsRequest() {
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
        },

        getProducts() {
            this.$emit('start-load')
            this.productsRequest()
            this.$emit('end-load')
        }
    }
}
