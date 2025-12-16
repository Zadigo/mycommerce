import type { ExtendedRouteParamsRawGeneric, MaybeGrapQlNode, MaybeProduct, Product, ProductNode, ProductsQuery, SearchedProducts } from '~/types'

/**
 * Composable for working with likes on the product
 * on a single product page 
 * @param product - The product to handle likes for
 */
export async function useLikeComposable(product: MaybeGrapQlNode<ProductNode>, callback?: (eventName: string) => void) {
  if (import.meta.server) {
    return {
      isLiked: ref<boolean>(false),
      icon: ref<string>('i-fa7-regular:heart'),
      handleLike: (_product?: MaybeProduct): void => { }
    }
  }

  const currentProduct = toValue(product)
  const { likedProducts } = await useStorageSetup()

  const isLiked = useArrayIncludes(likedProducts, currentProduct.node.id)
  // console.log('isLiked', isLiked, likedProducts)
  // const uniqueIds = useArrayUnique(likedProducts)
  // // Ensures only unique IDs in the storage
  // syncRef(uniqueIds, likedProducts, { direction: 'ltr' })

  function like() {
    if (isDefined(currentProduct)) {
      if (isLiked.value) {
        likedProducts.value = likedProducts.value.filter(id => id !== currentProduct.node.id)
      } else {
        likedProducts.value.push(currentProduct.node.id)
      }

      if (callback) callback('like')
    }
  }

  const icon = computed(() => isLiked.value ? 'i-fa7-solid:heart' : 'i-fa7-regular:heart')

  return {
    icon,
    /**
     * Whether the product is liked by the user
     * @default false
     */
    isLiked,
    /**
     * Adds a product to the list of products
     * added to the user's whishlist
     */
    like
  }
}

/** 
 * Composable for checking if a product has images,
 * sizes, and a main image.
 * @param product - The product to check for images
 */
export function useProductComposable<P extends MaybeGrapQlNode<ProductNode>>(product: P) {
  const currentProduct = toValue(product)
  
  if (!isDefined(product)) {
    return {
      hasImage: ref<boolean>(false),
      hasSizes: ref<boolean>(false),
      hasMainImage: ref<boolean>(false),
      numberOfImages: ref<number>(0),
      hasColorVariants: ref<boolean>(false)
    }
  } else {
    const hasImages = computed(() => currentProduct.node.productImages.length > 0)
    const hasSizes = computed(() => currentProduct.node.sizeSet.length > 0)
    const hasMainImage = computed(() => isDefined(currentProduct.node.mainImage))
    const numberOfImages = computed(() => currentProduct.node.productImages.length)
    const hasColorVariants = computed(() => currentProduct.node.colorVariants.length > 0)
  
    return {
      /**
       * Whether the product has color variants
       * @default false
       */
      hasColorVariants,
      /**
       * Number of images associated with the product
       * @default 0
       */
      numberOfImages,
      /**
       * Whether the product has images
       * @default false
       */
      hasImages,
      /**
       * Whether the product has sizes
       * @default false
       */
      hasSizes,
      /**
       * Whether the product has a main image
       * @default false
       */
      hasMainImage
    }
  }
}

/**
 * Composable for fetching product details.
 * This composable fetches the product details from the API
 * and returns it as a reactive state.
 */
export async function useProductDetailComposable() {
  const { id } = useRoute().params as ExtendedRouteParamsRawGeneric

  const { data: product, status } = await useFetch<Product>(`/api/products/${id}`, {
    method: 'GET',
    immediate: true,
    server: true,
    onResponseError({ error }) {
      createError({
        statusMessage: error?.message,
        statusCode: 404
      })
    }
  })

  console.log('Fetched product:', product.value)

  const isLoading = computed(() => status.value !== 'success')

  /**
   * Banner
   */

  const showBanner = ref<boolean>(false)

  if (import.meta.client) {
    const { y } = useScroll(window)

    watch(y, (newY) => {
      showBanner.value = newY >= 1200 && newY <= 7000
    })
  }

  return {
    /**
     * Product data fetched from the API
     */
    product,
    /**
     * Whether the product is currently being loaded
     */
    isLoading,
    /**
     * Whether the banner at the bottom of the page
     * should be show when the user scrolls down
     */
    showBanner
  }
}
