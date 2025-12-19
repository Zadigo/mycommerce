import type { ExtendedRouteParamsRawGeneric, MaybeProduct, MaybeType, ProductNode } from '~/types'

/**
 * Composable for working with likes on the product
 * on a single product page 
 * @param product - The product to handle likes for
 */
export async function useLikeComposable(product: MaybeType<ProductNode>, callback?: (eventName: string) => void) {
  if (import.meta.server) {
    return {
      isLiked: ref<boolean>(false),
      icon: ref<string>('i-fa7-regular:heart'),
      handleLike: (_product?: MaybeProduct): void => { }
    }
  }

  const _product = toValue(product)
  const { likedProducts } = await useStorageSetup()

  const isLiked = useArrayIncludes(likedProducts, isDefined(_product) ? _product.node.id : false)
  // console.log('isLiked', isLiked, likedProducts)
  // const uniqueIds = useArrayUnique(likedProducts)
  // // Ensures only unique IDs in the storage
  // syncRef(uniqueIds, likedProducts, { direction: 'ltr' })

  function like() {
    if (isDefined(_product)) {
      if (isLiked.value) {
        likedProducts.value = likedProducts.value.filter(id => id !== _product.node.id)
      } else {
        likedProducts.value.push(_product.node.id)
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
export function useProductComposable<P extends MaybeType<ProductNode>>(product: P) {
  const _product = toValue(product)
  
  if (!isDefined(product)) {
    return {
      hasImage: ref<boolean>(false),
      hasSizes: ref<boolean>(false),
      hasMainImage: ref<boolean>(false),
      numberOfImages: ref<number>(0),
      hasColorVariants: ref<boolean>(false)
    }
  } else {
    const hasImages = computed(() => isDefined(_product) ? _product.node.productImages.length > 0 : false)
    const hasSizes = computed(() => isDefined(_product) ? _product.node.sizeSet.length > 0 : false)
    const hasMainImage = computed(() => isDefined(_product) ? isDefined(_product.node.mainImage) : false)
    const numberOfImages = computed(() => isDefined(_product) ? _product.node.productImages.length : 0)
    const hasColorVariants = computed(() => isDefined(_product) ? _product.node.colorVariants.length > 0 : false)
  
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

  const { data: product, status } = await useFetch<ProductNode>(`/api/products/${id}`, {
    method: 'POST',
    immediate: true,
    body: `
    query {
      product(id: "UHJvZHVjdFR5cGU6Mg==") {
        id
        name
      }
    }
    `,
    onResponseError({ error }) {
      createError({
        statusMessage: error?.message,
        statusCode: 404
      })
    }
  })

  console.log('Fetched product:', product.value)

  const isLoading = computed(() => status.value !== 'success')


  return {
    /**
     * Product data fetched from the API
     */
    product,
    /**
     * Whether the product is currently being loaded
     */
    isLoading
  }
}
