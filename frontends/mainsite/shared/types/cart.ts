import type { Arrayable, Nullable } from './utils'
import type { BaseProduct } from './product'
import { z } from 'zod'

export type ClotheSizes = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL' | 'Unique'

export type ShoeSizes = '36' | '37' | '38' | '39' | '40' | '41' | '42' | '43' | '44' | '45' | '46'

export type BraSizes = '70A' | '70B' | '70C' | '70D' | '75A' | '75B' | '75C' | '75D' | '80A' | '80B' | '80C' | '80D' | '85A' | '85B' | '85C' | '85D'

export interface BaseSizeSet {
  active: boolean
  availability: boolean
  metric: string
  name: (ClotheSizes | ShoeSizes | BraSizes | 'Unique') & (string | {})
  variantPrice: number
}

export interface CartItem {
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
  paymentIntent: Nullable<string>
  authenticated: boolean
  viewCount: number
}
