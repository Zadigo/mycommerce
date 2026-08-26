import type { Arrayable, GraphQlData, Undefineable, RelayNode } from ".."

/**
 * @deprecated use #shared/types/products
 */
export interface BaseProductCollection {
	name: string
	viewName: string
	category: string
	description: string
	illustration: Undefineable<string>
	numberOfItems: number
	slug: string
	subCategory: string
	subcategorySlug: string
	tags: Nullable<Arrayable<string>>
	createdOn: string
}

/**
 * @deprecated use #shared/types/products
 */
export type ProductCollection = GraphQlData<'allCollections', Arrayable<BaseProductCollection>>

/**
 * @deprecated use #shared/types/products
 */
export type ProductCollectionNodes = RelayNode<BaseProductCollection>
