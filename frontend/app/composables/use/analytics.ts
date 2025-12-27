import type { Item } from 'nuxt-ganalytics'
import type { Arrayable, CartItem, ProductNode, Undefineable } from '~/types'
/**
 * A set of Google Analytics callbacks for product-related events
 * @param product The product to track
 * @param products A list of products to track
 */
export function useGoogleAnalyticsCallbacks(product?: MaybeRef<Undefineable<ProductNode>>, productNodes?: Arrayable<ProductNode>) {
  const { sendEvent } = useAnalyticsEvent()

  const _product = toValue(product)
  const _products = toValue(productNodes) 

  function _buildProductItem<I = Item>(): I {
    if (_product && isDefined(_product)) {
      return {
        item_name: _product.node.name,
        item_id: _product.node.id,
        price: _product.node.price,
        item_brand: '',
        item_category: _product.node.category,
        item_category2: _product.node.subCategory,
        item_category3: _product.node.color
      } as I
    } else {
      sendEvent(defineAnalyticsEvent('exception', {
        description: 'Product or products API error: Product is undefined',
        fatal: false
      }))
      return {} as I
    }
  }

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
      const item = _buildProductItem()

      await sendEvent(defineAnalyticsEvent('view_item', {
        items: [
          item
        ]
      }))
    }
  }

  async function selectProductEvent(index: number, listName?: string) {
    if (_product && isDefined(_product)) {
      const item = _buildProductItem()

      item.index = index
      item.item_list_name = listName || ''

      await sendEvent(defineAnalyticsEvent('select_item', {
        items: [
          item
        ]
      }))
    }
  }

  async function addToCartEvent(index?: Undefineable<number>, sizeName?: string) {
    if (_product && isDefined(_product)) {
      const item = _buildProductItem()

      item.index = index ?? undefined
      item.quantity = 1
      item.item_category5 = sizeName || undefined

      await sendEvent(defineAnalyticsEvent('add_to_cart', {
        currency: 'EUR',
        value: _product.node.price,
        items: [
          item
        ]
      }))
    }
  }

  async function viewCartEvent(items: Arrayable<CartItem>) {
    if (_product && isDefined(_product)) {
      await sendEvent(defineAnalyticsEvent('view_cart', {
        items: items.map((cartItem, idx) => ({
          index: idx,
          item_name: cartItem.product.name,
          item_id: cartItem.product.id,
          price: cartItem.product.price,
          item_brand: '',
          // item_category: cartItem.product.category,
          // item_category2: cartItem.product.subCategory,
          // item_category3: cartItem.product.variant.color,
          item_category4: cartItem.size.name,
          quantity: cartItem.quantity
        }))
      }))
    }
  }

  async function addShippingInfo(items: MaybeRef<Arrayable<CartItem>>, total: number) {
    if (_product && isDefined(_product)) {
      await sendEvent(defineAnalyticsEvent('add_shipping_info', {
        currency: 'EUR',
        value: total,
        items: toValue(items).map((item, idx) => ({
          index: idx,
          item_id: item.product.id,
          item_name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          // item_brand: '',
          // item_category: item.product.category,
          // item_category2: item.product.subCategory,
          // item_category3: item.product.variant.color,
          // item_variant: ''
        }) as Item) || []
      }))
    }
  }

  return {
    addShippingInfo,
    productEvent,
    selectProductEvent,
    viewProductsEvent,
    addToCartEvent,
    viewCartEvent
  }
}
