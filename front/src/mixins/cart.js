export default {
    data: () => ({
        addingToCart: false,
        productOptions: {
            default_size: 'Unique'
        }
    }),

    beforeMount() {
        var cart = this.getCart()
        this.$store.commit('updateCart', cart)
    },

    methods: {
        async removeFromCart(product) {
            try {
                var options = {
                    product: product.id,
                    session_id: this.getSessionId()
                }
                var response = await this.axios.post('cart/remove', options)
                var data = response.data

                this.$store.commit('updateCart', data)
                this.$localstorage.create('cart', data)
            } catch (error) {
                this.$store.dispatch('addErrorMessage', error)
            }
        },

        async simpleAddToCard(product, size, openOnCreate) {
            try {
                var details = {
                    product: product.id,
                    default_size: size.name,
                    session_id: this.getSessionId()
                }
                var response = await this.axios.post('cart/add', details)
                var data = response.data

                this.$store.commit('updateCart', data)
                this.$localstorage.create('cart', data)

                this.runCallback(openOnCreate)
            } catch (error) {
                this.$store.dispatch('addErrorMessage', error)
            }
        },

        runCallback(openOnCreate) {
            if (openOnCreate) {
                this.$store.commit('toggleModalCart')
            }
        },

        getCart() {
            return this.$localstorage.retrieve('cart')
        },

        getSessionId() {
            try {
                return this.getCart()['session_id']
            } catch {
                return null
            }
        }
    }
}
