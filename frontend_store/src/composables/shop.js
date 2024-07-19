import { ref } from 'vue'
import { useShop } from 'src/stores/shop'
import { useI18n } from "vue-i18n"

/**
 * A composable that implements default
 * resusable functions for the shop, such
 * as liking a product or adding it to
 * the user cart
 */ 
export function useShopComposable () {
  const shopStore = useShop()
  const isLiked = ref(false)

  /**
   * Function that manages products that were
   * liked locally (local storage) and in the
   * shop store 
   * 
   * @param {Object} product The product to like
   * @param {number} product.id The product ID
   */
  async function handleAnonymousLike (product) {
    product
  }

  /**
   * Function that manages products that were
   * liked by sending the requests to the backend
   * as required
   * 
   * @param {Object} product The product to like
   * @param {number} product.id The product ID
   */
  async function handleAuthenticatedLike (product) {
    product
  }
  
  /**
   * Main entry function for managing the user liked
   * products either locally or in the backend.
   * Handles the action of liking a product
   * and therefore adding it to the user's
   * wishlist
   * 
   * @param {Object} product The product to like
   * @param {number} product.id The product ID
   */
  async function handleLike(product) {
    isLiked.value = !isLiked.value

    if (isLiked.value) {
      shopStore.addToWishlist(product.id)
    } else {
      shopStore.removeFromWishlist(product.id)
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
export function useUtilities () {
  function localImagePath (path) {
    return `/${path}`
  }

  /**
   * Builds the full url path to the
   * django /media/ backend folder for
   * images that require this construction 
   * 
   * @param {String} path The path to the image `/media/../image.jpg`
   * @param {boolean} [mediaPrefix=false] Add the `/media/` prefix
   */
  function djangoMediaPath (path, mediaPrefix = false) {
    let url

    if (path === null || typeof path === 'undefined') {
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


/**
 * A special composable that generates products
 * for testing purposes 
 */
export function useMockups () {
  const testProducts = ref({})
  const { djangoMediaPath } = useUtilities()

  /**
   * 
   * @param {number} [size=100] The number of products to create
   * @returns {Object[]} List of products
   * @returns {Number} returns.id The product ID 
   */
  function createMockupProducts (size=100) {
    const image = djangoMediaPath('placeholder.svg', false, true)

    const products = Array.from({ length: size }, (k, v) => ({
      id: v + 1,
      name: `Soutien-gorge corbeille ${v + 1}`,
      color: 'White',
      category: 'A-line',
      description: 'Discover how to use Schema.org',
      images: [
        {
          id: 1429,
          name: "Jupe Cargo",
          product_set: [
            {
              id: 1105,
              name: "Jupe Cargo LanièRes"
            }
          ],
          original: image,
          thumbnail: image,
          mid_size: image
        }
      ],
      // sizes: [ 'XS', 'S', 'M' ],
      sizes: [
        {
          id: 1,
          name: 'XS',
          sub_category: 'Clothe size',
          availability: true,
        },
        {
          id: 2,
          name: 'S',
          sub_category: 'Clothe size',
          availability: true,
        },
        {
          id: 3,
          name: 'M',
          sub_category: 'Clothe size',
          availability: false,
        }
      ],
      variants: [1, 2],
      get_main_image: {
        id: 1430,
        name: "Jupe Cargo 2",
        product_set: [
          {
            id: 1105,
            name: "Jupe Cargo LanièRes"
          }
        ],
        original: image,
        thumbnail: image,
        mid_size: image
      },
      slug: `soutien-gorge-corbeille-${v + 1}`,
      get_price: 45.93,
      price: 45.93,
      active: true
    }))

    testProducts.value = products
    return products
  }

  /**
   * 
   * Get a specific product ID or return a random
   * item in the created list of products
   * 
   * @param {String | Number} [id=null] 
   */
  function createMockupProduct (id=null) {
    const products = createMockupProducts()
    if (id) {
      return products[id * 1 + 1]
    } else {
      const randomIndex = Math.floor(Math.random() * products.length) + 1
      return products[randomIndex]
    }
  }


  return {
    testProducts,
    createMockupProduct,
    createMockupProducts
  }
}
