import { arrayRemove, arrayUnion, updateDoc } from 'firebase/firestore'
import type { ExtendedRouteParamsRawGeneric, MaybeType, ProductNode } from '~/types'

/**
 * Composable for working with likes on the product
 * on a single product page 
 * @param product - The product to handle likes for
 */
export async function useLikeComposable(product: MaybeType<ProductNode>, callback?: (actionName: 'like' | 'unlike') => void) {
  const { docRef, session } = useSession()
    
  const _product = toValue(product)
  const productId = useToNumber(isDefined(_product) ? _product.node.id : '')
  const likedProducts = computed(() => isDefined(session) ? session.value.likedProducts : [])
  
  const isLiked = useArrayIncludes(likedProducts, productId.value)
  const icon = computed(() => isLiked.value ? 'i-fa7-solid:heart' : 'i-fa7-regular:heart')
  
  async function like() {
    if (isDefined(_product)) {
      if (isDefined(docRef)) {
        if (isLiked.value) {
          await updateDoc(docRef, { likedProducts: arrayRemove(productId.value) })
        } else {
          await updateDoc(docRef, { likedProducts: arrayUnion(productId.value) })
        }
        
        // const uniqueIds = useArrayUnique(session.value.likedProducts)
        // await updateDoc(docRef, { likedProducts: toValue(uniqueIds) })

        if (callback) {
          callback(isLiked.value ? 'unlike' : 'like')
        }
      }
    }
  }

  return {
    isLiked,
    icon,
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
    method: 'GET',
    immediate: true,
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
