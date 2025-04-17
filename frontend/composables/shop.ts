import type { Product, ProductImage } from "~/types"
// import { isRef } from 'vue'
import type { Ref } from 'vue'

export function useShopComposable() {
  // const { $i18n } = useNuxtApp()

  const showSearchModal = ref<boolean>(false)
  const isLiked = ref<boolean>(false)

  function validateProp<T extends Product | ProductImage>(item: T | object | null | undefined): item is T {
    if (!item || typeof item !== 'object') {
      return false
    } else {
      return (
        'id' in item &&
        typeof (item as T).id === 'number'
      )
    }
  }

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
    if (product) {
      if (items.includes(product.id)) {
        items.push(product.id)
      } else {
        const index = items.findIndex(x => product.id)
        items.splice(index, 1)
      }
    }
    return items
  }

  return {
    isLiked,
    validateProp,
    translatePrice,
    handleLike
  }
}
