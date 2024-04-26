import { ref } from 'vue'
import { useShop } from 'stores/shop'
import { useI18n } from "vue-i18n"

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

export function useUtilities () {
  /**
   * Builds the full url path to the
   * django /media/ backend folder for
   * images that require this construction 
   */
  function djangoMediaPath (path, local = false, mediaPrefix = false) {
    let url

    if (path === null || typeof path === 'undefined') {
      const image = new URL(`./assets/placeholder.svg`, import.meta.url)
      return image.toString()
    }

    if (local) {
      const image = new URL(`./assets/${path}`, import.meta.url)
      return image.toString()
    }

    if (import.meta.env.DEV) {
      url = import.meta.env.VITE_DEVELOPMENT_URL
    } else {
      url = import.meta.env.VITE_PRODUCTION_URL
    }

    if (mediaPrefix) {
      url += '/media/'
    }


    const finalUrl = new URL(path, url)
    return finalUrl.toString()
  }

  /**
   * Parses an incoming price/float formatted
   * as a string and then returns the currency
   * version of said number 
   */
  function translatePrice (price) {
    const { n } = useI18n()

    if (!price || typeof price === 'undefined') {
      return n(0, 'currency')
    }
    
    const priceNumber = parseFloat(price)
    return n(priceNumber, 'currency')
  }

  return {
    djangoMediaPath,
    translatePrice
  }
}


export function useMockups () {
  const testProducts = ref({})
  const { djangoMediaPath } = useUtilities()

  function createMockupProduct () {

  }

  function createMockupProducts () {
    djangoMediaPath
  }

  return {
    testProducts,
    createMockupProduct,
    createMockupProducts
  }
}
