import type { _DatabaseObject } from '../..'

/**
 * @deprecated
 */
export interface ProductStockApiResponse extends _DatabaseObject {
  variant: {
    id: number
    name: string
  }
  quantity: number
  in_stock: boolean
  almost_sold_out: boolean
  is_active: boolean
}
