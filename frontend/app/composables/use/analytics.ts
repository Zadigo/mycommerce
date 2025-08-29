import type { Product } from '~/types'

type MaybeProduct = MaybeRef<Product | undefined>

export function useAnalyticsCallback(product: MaybeProduct, index?: number) {
  const currentProduct = toRef(product)

  function triggerEvent(eventName: string) {
    if (isDefined(currentProduct)) {
      // TODO: G-Analytics
      // gtag('event', eventName, {
      //   items: {
      //     item_id: currentProduct.value?.id,
      //     item_name: currentProduct.value?.name,
      //     price: currentProduct.value?.get_price,
      //     quantity: 1,
      //     item_brand: null,
      //     item_category: currentProduct.value?.category,
      //     item_category2: currentProduct.value?.sub_category,
      //     item_variant: currentProduct.value?.color,
      //     index: index,
      //     item_reference: null
      //   }
      // })
    } else {
      // Handle case where product is not defined
    }
  }

  function triggerEventList(products: Product[]) {
    const items = useArrayMap(products, (prod, idx) => ({
      item_id: prod.id,
      item_name: prod.name,
      price: prod.get_price,
      quantity: 1,
      item_brand: null,
      item_category: prod.category,
      item_category2: prod.sub_category,
      item_variant: prod.color,
      index: idx,
      item_reference: null
    }))

    // TODO: G-Analytics
    // gtag('event', 'add_to_wishlist', {
    //   items
    // })
  }

  return {
    triggerEvent,
    triggerEventList
  }
}

export function useProductNavigationAnalytics() {
  /**
   * Function that handles and routes navigation events
   * to Google Analytics
   * @param data The product that is being navigated to
   */
  function sendAnalytics(data: (number | Product)[] | null | undefined) {
    if (isDefined(data)) {
      const [id, product] = data

      if (isDefined(product)) {
        // TODO: G-Analytics
        // if (product && typeof product === 'object' && 'id' in product) {
        //   gtag('event',  'select_item',  {
        //     items: [
        //       {
        //         item_id: product.id,
        //         item_name: product.name,
        //         price: product.get_price,
        //         item_brand: null,
        //         item_category: product.category,
        //         index: data[0]
        //       }
        //     ],
        //     item_list_name: route.params.id,
        //     item_list_id: route.params.id,
        //     currency: 'EUR'
        //   })
        // }
      }

    }
  }

  return {
    sendAnalytics
  }
}
