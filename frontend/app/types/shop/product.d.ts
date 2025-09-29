import type { _DatabaseObject, _DateTimes } from '..'

export type ProductSizes = _DatabaseObject & {
  name: DefaultClotheSize
  metric: 'Clothe' | 'Shoe'
  availability: boolean
  active: boolean
}

declare type ProductSet = _DatabaseObject & {
  name: string
  color: string
  color_variant_name: string
}

export type ProductImage = _DatabaseObject & {
  name: string
  product_set: ProductSet[]
  original: string
  thumbnail: string
  mid_size: string
  is_main_image: boolean
}

export interface ProductVariant extends _DatabaseObject {
  color: string
  get_main_image: ProductImage
  active: boolean
}

export type ProductCollection = _DatabaseObject & {
  name: string
  category: string
  sub_category: string
  number_of_items: number
  illustration: string | null
  tags: string[] | null
  get_view_name: string
}

/**
 * Base object representing a product in
 * for the e-commerce website 
 */
export type Product = _DatabaseObject & _DateTimes & {
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
  collection_set: ProductCollection[] | null
  get_main_image: ProductImage | null
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
