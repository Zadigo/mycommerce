import type { Nullable, Arrayable } from '.'
import type { GraphQlData, RelayEdge, RelayNode } from './graphql'

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

export interface BaseProduct {
	id: string
	name: string
	category: string
	color: string
	createdOn: string
	displayNew: boolean
	hasSizes: boolean
	genderCategory: string
	isNew: boolean
	modelHeight: Nullable<number>
	modelSize: Nullable<string>
	modifiedOn: string
	onSale: boolean
	unitPrice: number
	subCategory: string
	slug: string
	sku: string
	salePrice: number
	price: number
	saleValue: number
}

export type ProductNode = RelayNode<BaseProduct> & {
  mainImage: BaseMainImage
  images: Arrayable<BaseImage>
  collectionSet: CollectionSetNodes
  sizeSet: Arrayable<BaseSizeSet>
  video: Nullable<BaseVideo>
}

export type Product = GraphQlData<'allProducts', ProductNode>

export type SearchedProducts = GraphQlData<'searchProducts', ProductNode>
