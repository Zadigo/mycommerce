export default {
    beforeMount() {
        var cart = this.getCart()
        this.$store.commit('updateCart', cart)
    },

    methods: {
        getCart () {
            return this.$localstorage.retrieve('cart')
        },

        getSessionId () {
            return this.getCart()['session_id']
        },
        
        removeFromCart (item) {
            this.$api.shop.cart.remove(item, this.getSessionId())
            .then((response) => {   
                var data = response.data

                this.$store.commit('updateCart', data)
                this.$localstorage.create('cart', data)
            })
            .catch((error) => {
                console.log(error)
                this.$store.dispatch('addErrorMessage', 'error.response.statusText')
            })
        }
    }
}
