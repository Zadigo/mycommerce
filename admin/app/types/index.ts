export interface ProductImage {
  id: number
  name: string
  product_set: {
    id: number
    name: string
    color: string
    color_variant_name: string
  }[]
  thumbnail: string
  mid_size: string
  is_main_image: boolean
}
  
export interface Product {
  id: number
  name: string
}
