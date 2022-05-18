/**
 * Implements functionnalities for components
 * and views that require working with the cart
 * 
 */

import { ref } from 'vue'

export default function useCartComposable() {
    const addingToCart = ref(false)
    const productOptions = ref({ default_size: 'Unique' })

    /**
     * Function allows us to remove a product
     * from the cart
     * 
     * @param {Object} product - product to remove
     * 
     */
    async function removeFromCart(product) {
        try {
            var options = {
                product: product.id,
                session_id: this.getSessionId()
            }
            var response = await this.axios.post('cart/remove', options)
            var data = response.data

            this.store.$patch((state) => {
                state.cart = data
                this.$localstorage.create('cart', data)
            })
        } catch (error) {
            console.error(error)
            this.store.addErrorMessage(error)
        }
    }

    /**
     * Function that adds a product to the cart
     * rapidly
     * 
     * @param {Object} product - product to add
     * @param {String} size - the product's size
     */
    async function quickAddToCart(product, size) {
        try {
            console.info(this.axios)
            var details = {
                product: product.id,
                default_size: size.name,
                // NOTE: Check here
                session_id: this.getSessionId()
            }
            var response = await this.axios.post('cart/add', details)
            var data = response.data

            this.store.updateCart(data)
            this.$localstorage.create('cart', data)

            // this.runCallback(openOnCreate)
        } catch (error) {
            console.log(error)
            this.store.addErrorMessage(error)
        }
    }

    // function runCallback(openOnCreate) {
    //     if (openOnCreate) {
    //         this.$store.commit('toggleModalCart')
    //     }
    // }

    /**
     * Return the user cart
     * 
     * @returns Cart
     * 
     */
    function getCart() {
        return this.$localstorage.retrieve('cart')
    }
    
    function getSessionId() {
        try {
            return this.getCart()['session_id']
        } catch {
            return null
        }
    }

    // onBeforeMount(() => {
    //     var cart = getCart()
    //     this.store.update(cart)
    // })

    return {
        addingToCart,
        productOptions,
        removeFromCart,
        quickAddToCart,
        getCart,
        getSessionId
    }
}
