import type { Arrayable, ProductNode, Undefineable } from '~/types'
import type { EventNames } from 'nuxt-ganalytics'

/**
 * A set of Google Analytics callbacks for product-related events
 * @param product The product to track
 * @param products A list of products to track
 */
export function useGoogleAnalyticsCallbacks(product?: MaybeRef<Undefineable<ProductNode>>, productNodes?: Arrayable<ProductNode>) {
  const { sendEvent } = useAnalyticsEvent()

  const _product = toValue(product)
  const _products = toValue(productNodes)

  async function viewProductsEvent(listName?: string) {
    if (isDefined(_products)) {
      const items = _products.map((product, idx) => ({
        index: idx,
        item_name: product.node.name,
        item_id: product.node.id,
        price: product.node.price,
        item_brand: '',
        item_category: product.node.category,
        item_category2: product.node.subCategory,
        item_category3: product.node.color,
        item_list_name: listName || ''
      }))

      await sendEvent(defineAnalyticsEvent('view_item_list', { items }))
    }
  }

  async function productEvent() {
    if (_product && isDefined(_product)) {
      await sendEvent(defineAnalyticsEvent('view_item', {
        items: [
          {
            index: 0,
            item_name: _product.node.name,
            item_id: _product.node.id,
            price: _product.node.price,
            item_brand: '',
            item_category: _product.node.category,
            item_category2: _product.node.subCategory,
            item_category3: _product.node.color
          }
        ]
      }))
    }
  }

  async function selectProductEvent(index: number, listName?: string) {
    if (_product && isDefined(_product)) {
      await sendEvent(defineAnalyticsEvent('select_item', {
        items: [
          {
            index,
            item_name: _product.node.name,
            item_id: _product.node.id,
            price: _product.node.price,
            item_brand: '',
            item_category: _product.node.category,
            item_category2: _product.node.subCategory,
            item_category3: _product.node.color,
            item_list_name: listName || ''
          }
        ]
      }))
    }
  }

  async function addToCartEvent(index?: number) {
    if (_product && isDefined(_product)) {
      await sendEvent(defineAnalyticsEvent('add_to_cart', {
        currency: 'EUR',
        value: _product.node.price,
        items: [
          {
            index: index ?? 0,
            item_name: _product.node.name,
            item_id: _product.node.id,
            price: _product.node.price,
            item_brand: '',
            item_category: _product.node.category,
            item_category2: _product.node.subCategory,
            item_category3: _product.node.color,
            quantity: 1
          }
        ]
      }))
    }
  }

  return {
    productEvent,
    selectProductEvent,
    viewProductsEvent,
    addToCartEvent
  }
}
