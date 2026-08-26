import type { Nullable, Arrayable, MaybeEmpty } from '..'
import type { GraphQlData, RelayEdge, RelayNode } from '.'

/**
 * @deprecated use #shared/types/products
 */
export type GenderCategory = 'Man' | 'Woman' | 'Kid' | 'Unisex'

/**
 * @deprecated use #shared/types/products
 */
export type AgeGroupCategory = 'Kid' | 'Adult'

/**
 * @deprecated use #shared/types/products
 */
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

/**
 * @deprecated use #shared/types/products
 */
export type CollectionSetNodes = RelayEdge<BaseCollectionSet>

/**
 * @deprecated use #shared/types/products
 */
export type CollectionSetNode = RelayNode<BaseCollectionSet>

/**
 * @deprecated use #shared/types/products
 */
export interface BaseImage {
	id: string
	name: string
	original: string
	thumbnail: string
	variant: string
	isMainImage: boolean
	createdOn: string
}

/**
 * @deprecated use #shared/types/products
 */
export type BaseMainImage = BaseImage

/**
 * @deprecated use #shared/types/products
 */
export type BaseVideo = Pick<BaseImage, 'name'> & { content: string }

/**
 * @deprecated use #shared/types/products
 */
export type ClotheSizes = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL' | 'Unique'

/**
 * @deprecated use #shared/types/products
 */
export type ShoeSizes = '36' | '37' | '38' | '39' | '40' | '41' | '42' | '43' | '44' | '45' | '46'

/**
 * @deprecated use #shared/types/products
 */
export type BraSizes = '70A' | '70B' | '70C' | '70D' | '75A' | '75B' | '75C' | '75D' | '80A' | '80B' | '80C' | '80D' | '85A' | '85B' | '85C' | '85D'

/**
 * @deprecated use #shared/types/products
 */
export interface BaseSizeSet {
	active: boolean
	availability: boolean
	metric: string
	name: (ClotheSizes | ShoeSizes | BraSizes | 'Unique') & (string | {})
	variantPrice: number
}

/**
 * @deprecated use #shared/types/products
 */
export type BaseColorVariant = Pick<_BaseProduct, 'id' | 'name'> & { mainImage: Pick<BaseMainImage, 'thumbnail'> }

/**
 * @deprecated use #shared/types/products
 */
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

/**
 * @deprecated use #shared/types/products
 */
export type BaseProduct = _BaseProduct & {
  mainImage: BaseMainImage
  productImages: Arrayable<BaseImage>
  collectionSet: CollectionSetNodes
  sizeSet: Arrayable<BaseSizeSet>
  video: Nullable<BaseVideo>
}

/**
 * @deprecated use #shared/types/products
 */
export type ProductNode = RelayNode<BaseProduct>

/**
 * @deprecated use #shared/types/products
 */
export type Product = GraphQlData<'allProducts', RelayEdge<BaseProduct>>

/**
 * @deprecated use #shared/types/products
 */
export type SearchedProducts = GraphQlData<'searchProducts', RelayEdge<BaseProduct>>

/**
 * @deprecated use #shared/types/products
 */
export type ProductsByCategory = GraphQlData<'productsByCategory', RelayEdge<BaseProduct>>

/**
 * @deprecated use #shared/types/products
 */
export type ProductRecommendations = GraphQlData<'recommendations', Arrayable<BaseProduct>>
