import type { Arrayable } from '@vueuse/core'
import type { BaseProduct, BaseSizeSet } from '../graphql'

export type CartItem = {
  product: Pick<BaseProduct, 'id' | 'name' | 'price' | 'salePrice' | 'unitPrice' | 'mainImage'>
  size: BaseSizeSet
  quantity: number
  total: number
}

export type CartSessionData = {
  sessionId: string
  items: Arrayable<CartItem>
  total: number
  numberOfItems: number
}
