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
  function localImagePath (path) {
    // const image = new URL(`./assets/${path}`, import.meta.url)
    // return image.toString()
    return `/public/${path}`
  }

  /**
   * Builds the full url path to the
   * django /media/ backend folder for
   * images that require this construction 
   */
  function djangoMediaPath (path, mediaPrefix = false) {
    let url

    if (path === null || typeof path === 'undefined') {
      // const image = new URL(`./assets/placeholder.svg`, import.meta.url)
      // return image.toString()
      return localImagePath('placeholder.svg')
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

  function conditionalImagePath (path, fallback = 'placeholder.svg') {
    const result  = djangoMediaPath(path)
    if (!result) {
      return localImagePath(fallback)
    } else {
      return result
    }
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

  /**
   * From a product object parse the path
   * for the main image 
   */
  function parseMainImage(product, size = 'original') {
    const data = product.get_main_image
    if (data === null || typeof data === 'undefined') {
      return localImagePath('placeholder.svg')
    } else {
      return djangoMediaPath(data[size])
    }
  }

  return {
    parseMainImage,
    conditionalImagePath,
    djangoMediaPath,
    localImagePath,
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
