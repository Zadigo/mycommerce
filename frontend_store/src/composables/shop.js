import { ref } from "vue"
import { useShop } from 'stores/shop'

/**
 * A composable that implements default
 * resusable functions for the shop, such
 * as liking a product or adding it to
 * the user cart
 * 
 */ 
export function useShopComposable () {
  const shopStore = useShop()
  const isLiked = ref(false)
  
  async function handleLike(product) {
    // Handles the action of liking a product
    // and therefore adding it to the user's
    // wishlist
    isLiked.value = !isLiked.value

    if (isLiked.value) {
      shopStore.addToWishlist(product)
    } else {
      shopStore.removeFromWishlist(product)
    }
  }
  
  return {
    isLiked,
    handleLike
  }
}
