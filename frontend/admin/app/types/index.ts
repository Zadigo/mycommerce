export interface ProductImage {
  id: number
  name: string
  product_set: {
    id: number
    name: string
    color: string
    color_variant_name: string
  }[]
  original: string
  thumbnail: string
  mid_size: string
  is_main_image: boolean
}
  
export interface Product {
  id: number
  name: string
  unit_price: string
  get_main_image: ProductImage | null
  images: ProductImage[]
  active: false
}

export type NewProduct = Pick<Product, 'name' | 'unit_price' | 'active'> & {
  color: string
  category: string
  sub_category: string
  model_height: number | null
  model_size: number | null
  sizes: string[]
  sale_value: number
  sale_price: number
  on_sale: boolean
  is_new: boolean
}


// export interface NewProduct {
//   name: '',
//   color: '',
//   category: 'Not attributed',
//   sub_category: 'Not attributed',
//   unit_price: 0,
//   model_height: null,
//   model_size: null,
//   sizes: [],
//   sale_value: 0,
//   sale_price: 0,
//   on_sale: false,
//   is_new: false,
//   active: false
// }
