import { useArrayFindIndex, useStorage, watchArray } from '@vueuse/core'
import type { Product } from "~/types"

/**
 * Composable for working with likes on the product
 * on a single product page 
 */
export function useLikeComposable(product: Product | null | undefined) {
  if (import.meta.server) {
    return {
      productToCheck: ref<Product>(),
      likedProducts: ref<number[]>([]),
      isLiked: ref<boolean>(false),
      handleLike: (_product?: Product | null | undefined): void => {}
    }
  }

  const productToCheck = ref<Product | null | undefined>(product)
  
  const likedProducts = useStorage<number[]>('likedProducts', [])
  const isLiked = computed(() => {
    if (productToCheck.value) {
      return useArrayIncludes(likedProducts, productToCheck.value.id).value
    } else {
      return false
    }
  })

  watchArray(likedProducts, () => {
    // Do something
  })

  /**
   * Adds a product to the list of products
   * added to the user's whishlist
   */
  function handleLike() {
    if (productToCheck.value) {
      if (isLiked.value) {
        const index = useArrayFindIndex<number>(likedProducts, () => productToCheck.value?.id)
        likedProducts.value.splice(index.value, 1)
      } else {
        likedProducts.value.push(productToCheck.value.id)
      }
      console.log('useLikeComposable', isLiked.value, likedProducts.value)
    }
  }

  return {
    productToCheck,
    isLiked,
    handleLike
  }
}
