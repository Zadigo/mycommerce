import type { Product, ProductImage } from "~/types"
import type { Ref } from 'vue'

export function useShopComposable() {
  const isLiked = ref<boolean>(false)

  /**
   * A composable that implements default
   * resusable functions for the shop, such
   * as liking a product or adding it to
   * the user cart
   */
  function translatePrice(value: string | number | undefined | Ref) {
    return value
    // if (isRef<string | number>(value)) {
    //   price = value.value
    // }

    // if (value) {
    //   let price

    //   if (typeof value === 'string') {
    //     price = parseFloat(value)
    //   } else {
    //     price = value
    //   }

    //   return $i18n.n(price, 'currency', $i18n.locale)
    // } else {
    //   return '0'
    // }
  }

  /**
   * Main entry function for managing the user liked
   * products either locally or in the backend.
   * Handles the action of liking a product
   * and therefore adding it to the user's
   * wishlist
   */
  function handleLike(items: number[], product: Product | null | undefined): number[] {
    return [1, 2]
  }

  return {
    isLiked,
    translatePrice,
    handleLike
  }
}
