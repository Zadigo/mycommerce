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
        getCart() {
            return this.$localstorage.retrieve('cart')
        },

        getSessionId() {
            return this.getCart()['session_id']
        },

        // async addToCart() {
        //     this.addingToCart = true
            
        //     var options = this.productOptions      
        //     Object.assign(options, {
        //         product: 1,
        //         session_id: this.getSessionId()
        //     })      
        //     // options['session_id'] = this.getSessionId()

        //     try {
        //         var response = this.$axios.post('/cart/add', options)

        //         this.$store.commit('updateCart', response.data)
        //         this.$localstorage.create('cart', response.data)

        //         setTimeout(() => {
        //             this.addingToCart = false
        //             this.productOptions.default_size = 'Unique'
        //         }, 2000);
        //     } catch(error) {
        //         this.$store.dispatch('addErrorMessage', error.response.statusText)
        //     }
        // },
        
        removeFromCart(item) {
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
