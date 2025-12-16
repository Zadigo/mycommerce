import type { Nullable, Arrayable } from '.'
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
	createdOn: string
	isMainImage: boolean
	name: string
	original: string
	thumbnail: string
	variant: string
}

export type BaseMainImage = BaseImage

export type BaseVideo = Pick<BaseImage, 'name'> & { content: string }

export interface BaseSizeSet {
	active: boolean
	availability: boolean
	metric: string
	name: string
	variantPrice: number
}

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
}

export type BaseProduct = _BaseProduct & {
  mainImage: BaseMainImage
  productImages: Arrayable<BaseImage>
  collectionSet: CollectionSetNodes
  sizeSet: Arrayable<BaseSizeSet>
  video: Nullable<BaseVideo>
}

export type Product = GraphQlData<'allProducts', RelayEdge<BaseProduct>>

export type SearchedProducts = GraphQlData<'searchProducts', RelayEdge<BaseProduct>>

export type ProductsByCategory = GraphQlData<'productsByCategory', RelayEdge<BaseProduct>>
