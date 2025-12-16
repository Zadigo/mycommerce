import type { DefaultClotheSize } from '~/data/constants/constants'
import type { _DatabaseObject, _DateTimes, Nullable } from '../..'

/**
 * @deprecated
 */
export type ProductSizes = _DatabaseObject & {
  name: DefaultClotheSize
  metric: 'Clothe' | 'Shoe'
  availability: boolean
  active: boolean
}

/**
 * @deprecated
 */
declare type ProductSet = _DatabaseObject & {
  name: string
  color: string
  color_variant_name: string
}

/**
 * @deprecated
 */
export type ProductImage = _DatabaseObject & {
  name: string
  product_set: ProductSet[]
  original: string
  thumbnail: string
  mid_size: string
  is_main_image: boolean
}

/**
 * @deprecated
 */
export interface ProductVariant extends _DatabaseObject {
  color: string
  get_main_image: ProductImage
  active: boolean
}

/**
 * @deprecated
 */
export type ProductCollection = _DatabaseObject & {
  name: string
  category: string
  sub_category: string
  number_of_items: number
  illustration: Nullable<string>
  tags: Nullable<string[]>
  get_view_name: string
}

/**
 * Base object representing a product in
 * for the e-commerce website
 * @deprecated
 */
export type ProductApi = _DatabaseObject & _DateTimes & {
  name: string
  color: string
  category: string
  sub_category: string
  sizes: ProductSizes[]
  has_sizes: boolean
  unit_price: string
  get_price: string
  sale_value: number
  sale_price: string
  on_sale: boolean
  display_new: boolean
  collection_set: Nullable<ProductCollection[]>
  get_main_image: Nullable<ProductImage>
  images: ProductImage[]
  model_height: string
  model_size: string
  color_variant_name: string
  is_new: boolean
  active: boolean
  display_new: boolean
  slug: string
  sku: string
  variants: ProductVariant[]
}
