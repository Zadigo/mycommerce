import type { GraphQlData, RelayEdge, RelayNode } from "./graphql"

export interface MainImage {
  id: string
  active: boolean
  createdOn: string
  isMainImage: boolean
  name: string
  original: string
  thumbnail: string
  variant: string
}

export type BaseProduct = {
  id: string
  name: string
  mainImage: Nullable<MainImage>
  productImages: MainImage[]
  sizeSet:  BaseSizeSet[] | null
  active: boolean
  ageGroupCategory: string
  category: string
  color: string
  createdOn: string
  displayNew: boolean
  genderCategory: string
  hasSizes: boolean
  modelHeight: Nullable<number>
  modelSize: Nullable<number>
  modifiedOn: string
  onSale: boolean
  price: number
  salePrice: number
  saleValue: number
  sku: string
  slug: string
  subCategory: string
  unitPrice: number
  video: unknown
}

export type ProductNode = RelayNode<BaseProduct>

export type AllProducts = GraphQlData<'allProducts', RelayEdge<BaseProduct>>

export type Product = GraphQlData<'product', BaseProduct>

export type SearchProducts = GraphQlData<'searchProducts', RelayEdge<BaseProduct>>

export type ProductsByCategory = GraphQlData<'productsByCategory', RelayEdge<BaseProduct>>
