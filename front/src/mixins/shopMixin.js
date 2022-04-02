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
                    response = await this.axios.get(`/collection/${collectionName}`)
                }
                return response
            } catch(error) {
                console.log(error)
                this.$store.dispatch('addErrorMessage', this.$t('An error occured'))
            }   
        },

        async getProducts() {
            try {
                this.$emit('start-load')

                var response = await this.productsRequest()
                var products = response.data

                this.$store.commit('setProducts', products)
                this.$session.create('products', products)

                this.$emit('end-load')
                // setTimeout(() => {
                // }, 1000);
            } catch(error) {
                console.log(error)
                this.$store.dispatch('addErrorMessage', this.$t('An error occured'))
            }
        }
    }
}
