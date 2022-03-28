/*
    Implements functionnalities for components
    and views that require working with products
    in the backend
*/ 

export default {
    methods: {
        async getProducts() {
            try {
                this.$emit('start-load')

                var collectionName = this.$route.params.collection
                var response = null
                if (collectionName == 'all') {
                    response = await this.$axios.get('/collection/all')
                } else {
                    response = await this.$axios.get(`/collection/${collectionName}`)
                }
                var products = response.data

                this.$store.commit('setProducts', products)
                this.$session.create('products', products)

                setTimeout(() => {
                    this.$emit('end-load')
                }, 1000);
            } catch(error) {
                this.$store.dispatch('addErrorMessage', this.$t('An error occured'))
            }
        }
    }
}
