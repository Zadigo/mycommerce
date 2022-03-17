/*
    Implements functionnalities for components
    and views that require working with products
    in the backend
*/ 

export default {
    methods: {
        getProducts() {
            this.$emit('start-load')

            var endpoint = null
            var collectionName = this.$route.params.collection

            if (collectionName == 'all') {
                endpoint = this.$api.shop.collection.all()
            } else {
                endpoint = this.$api.shop.collection.get(collectionName)
            }

            endpoint.then((response) => {
                var products = response.data

                this.$store.commit('setProducts', products)
                this.$session.set('products', products)

                setTimeout(() => {
                    this.$emit('end-load')
                }, 1000);
            })
            .catch((error) => {
                this.$store.dispatch('addErrorMessage', error.response.statusText)
            })
        }
    }
}
