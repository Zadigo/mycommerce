import { useArrayFindIndex, useStorage, watchArray } from '@vueuse/core'
import type { Product } from "~/types"

export function useShopComposable(product: Product) {
  if (import.meta.server) {
    return {
      productToCheck: ref<Product>(),
      likedProducts: ref<number[]>([]),
      isLiked: ref<boolean>(false),
      handleLike: (_product?: Product | null | undefined): void => {}
    }
  }

  const productToCheck = ref<Product>(product)
  
  const likedProducts = useStorage<number[]>('likedProducts', [])
  const isLiked = computed(() => {
    return useArrayIncludes(likedProducts, productToCheck.value.id).value
  })

  watchArray(likedProducts, () => {
    // Do something
  })

  /**
   * Main entry function for managing the user liked
   * products either locally or in the backend.
   * Handles the action of liking a product
   * and therefore adding it to the user's
   * wishlist
   */
  function handleLike() {
    if (product) {
      if (isLiked.value) {
        const index = useArrayFindIndex<number>(likedProducts, () => productToCheck.value.id)
        likedProducts.value.splice(index.value, 1)
      } else {
        likedProducts.value.push(productToCheck.value.id)
      }
      console.log('useShopComposable', isLiked.value, likedProducts.value)
    }
  }

  return {
    productToCheck,
    isLiked,
    handleLike
  }
}
