import type { Nullable, Arrayable, MaybeEmpty } from '..'
import type { GraphQlData, RelayEdge, RelayNode } from '.'

export type GenderCategory = 'Man' | 'Woman' | 'Kid' | 'Unisex'

export type AgeGroupCategory = 'Kid' | 'Adult'

export type MainCategory = 'Accessories' 
	| 'Activewear'
	| 'Bags'
	| 'Bras'
	| 'Denim'
	| 'Dresses'
	| 'Pants'
	| 'Panties'
	| 'Shoes'
	| 'Skirts'
	| 'Shorts'
	| 'Suits'
	| 'Tops'
	| 'Other'
	| 'Not attributed'

export interface BaseCollectionSet {
	id: string
	name: string
	slug: string
	subCategory: string
	subcategorySlug: string
}

export type CollectionSetNodes = RelayEdge<BaseCollectionSet>

export type CollectionSetNode = RelayNode<BaseCollectionSet>

export interface BaseImage {
	id: string
	name: string
	original: string
	thumbnail: string
	variant: string
	isMainImage: boolean
	createdOn: string
}

export type BaseMainImage = BaseImage

export type BaseVideo = Pick<BaseImage, 'name'> & { content: string }

export type ClotheSizes = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL'

export type ShoeSizes = '36' | '37' | '38' | '39' | '40' | '41' | '42' | '43' | '44' | '45' | '46'

export type BraSizes = '70A' | '70B' | '70C' | '70D' | '75A' | '75B' | '75C' | '75D' | '80A' | '80B' | '80C' | '80D' | '85A' | '85B' | '85C' | '85D'

export interface BaseSizeSet {
	active: boolean
	availability: boolean
	metric: string
	name: (ClotheSizes | ShoeSizes | BraSizes | 'Unique') & (string | {})
	variantPrice: number
}

export type BaseColorVariant = Pick<_BaseProduct, 'id' | 'name'> & { mainImage: Pick<BaseMainImage, 'thumbnail'> }

interface _BaseProduct {
	id: string
	name: string
	category: string
	color: string
	createdOn: string
	displayNew: boolean
	hasSizes: boolean
	genderCategory: GenderCategory
	ageGroupCategory: AgeGroupCategory
	isNew: boolean
	modelHeight: Nullable<number>
	modelSize: Nullable<string>
	modifiedOn: string
	onSale: boolean
	unitPrice: number
	category: MainCategory
	subCategory: string
	slug: string
	sku: string
	salePrice: number
	price: number
	saleValue: number
	colorVariants: Arrayable<BaseColorVariant>
}

export type BaseProduct = _BaseProduct & {
  mainImage: BaseMainImage
  productImages: Arrayable<BaseImage>
  collectionSet: CollectionSetNodes
  sizeSet: Arrayable<BaseSizeSet>
  video: Nullable<BaseVideo>
}

export type ProductNode = RelayNode<BaseProduct>

export type Product = GraphQlData<'allProducts', RelayEdge<BaseProduct>>

export type SearchedProducts = GraphQlData<'searchProducts', RelayEdge<BaseProduct>>

export type ProductsByCategory = GraphQlData<'productsByCategory', RelayEdge<BaseProduct>>
