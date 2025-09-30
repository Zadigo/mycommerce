import type { MaybeProduct } from '~/types'

/**
 * Composable for working with likes on the product
 * on a single product page 
 * @param product - The product to handle likes for
 */
export async function useLikeComposable(product: MaybeProduct, callback?: () => void) {
  if (import.meta.server) {
    return {
      isLiked: ref<boolean>(false),
      icon: ref<string>('i-fa7-regular:heart'),
      handleLike: (_product?: MaybeProduct): void => { }
    }
  }

  const currentProduct = toRef(product)
  const { likedProducts } = await useStorageSetup()

  const isLiked = useArrayIncludes(likedProducts, currentProduct.value?.id)
  console.log('isLiked', isLiked, likedProducts)
  // const uniqueIds = useArrayUnique(likedProducts)
  // // Ensures only unique IDs in the storage
  // syncRef(uniqueIds, likedProducts, { direction: 'ltr' })

  function like() {
    if (isDefined(currentProduct)) {
      if (isLiked.value) {
        likedProducts.value = likedProducts.value.filter(id => id !== currentProduct.value.id)
      } else {
        likedProducts.value.push(currentProduct.value.id)
      }

      if (callback) callback()
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
