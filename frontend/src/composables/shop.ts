import { useShop } from '@/stores/shop'
import { isUndefined } from 'lodash'
import { ref } from 'vue'
import { useI18n } from "vue-i18n"
import { Product, ProductVariant } from '../types/shop'

declare type ImageSizes = 'original' | 'mid_size' | 'thumbnail'

/**
 * A composable that implements default
 * resusable functions for the shop, such
 * as liking a product or adding it to
 * the user cart
 */ 
export function useShopComposable () {
  const shopStore = useShop()
  const isLiked = ref<boolean>(false)

  /**
   * Function that manages products that were
   * liked locally (local storage) and in the
   * shop store 
   */
  async function handleAnonymousLike (product: Product) {
    product
  }

  /**
   * Function that manages products that were
   * liked by sending the requests to the backend
   * as required
   */
  async function handleAuthenticatedLike (product: Product) {
    product
  }
  
  /**
   * Main entry function for managing the user liked
   * products either locally or in the backend.
   * Handles the action of liking a product
   * and therefore adding it to the user's
   * wishlist
   */
  async function handleLike(product: Product | undefined) {
    if  (typeof product !== 'undefined') {
      isLiked.value = !isLiked.value
  
      if (isLiked.value) {
        shopStore.addToWishlist(product.id)
      } else {
        shopStore.removeFromWishlist(product.id)
      }
    }
  }
  
  return {
    isLiked,
    handleLike,
    handleAnonymousLike,
    handleAuthenticatedLike
  }
}

/**
 * Utility functions 
 */
export function useShopUtilities () {
  function localImagePath (path: string): string {
    return `/${path}`
  }

  /**
   * Builds the full url path to the
   * django /media/ backend folder for
   * images that require this construction 
   */
  function djangoMediaPath(path: string, mediaPrefix: boolean = false): string {
    let url;

    if (!path || isUndefined(path)) {
      return localImagePath("placeholder.svg");
    }

    if (import.meta.env.DEV) {
      url = import.meta.env.VITE_DEVELOPMENT_URL;
    } else {
      url = import.meta.env.VITE_PRODUCTION_URL;
    }

    if (mediaPrefix) {
      url += "/media/";
    }

    const finalUrl = new URL(path, url);
    return finalUrl.toString();
  }

  /**
   * Builds the full url path to the
   * django /media/ backend folder for
   * images that require this construction
   * and if the image is null, return a fallback
   * placeholder image
   * 
   * @param {String} path The path to the image `/media/../image.jpg`
   * @param {string} [fallback='placeholder.svg'] The fallback image to use
   */
  function conditionalImagePath (path: string, fallback: string = 'placeholder.svg') {
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
  function translatePrice (price: number | string | null | undefined): string {
    const { n } = useI18n()

    if (!price || typeof price === 'undefined') {
      return n(0, 'currency')
    }

    if (typeof price === 'number') {
      return n(price, 'currency')
    }
    
    const priceNumber = parseFloat(price)
    return n(priceNumber, 'currency')
  }

  /**
   * From a product object parse the path
   * for the main image 
   */
  function parseMainImage(product: Product | ProductVariant | null | undefined, size: ImageSizes = 'original') {
    if (product) {
      const mainImage = product.get_main_image
  
      if (mainImage === null || Object.keys(product).length === 0) {
        return localImagePath('placeholder.svg')
      } else {
        return djangoMediaPath(mainImage[size])
      }
    } else {
      return localImagePath("placeholder.svg")
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