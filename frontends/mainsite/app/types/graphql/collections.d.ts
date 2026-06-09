import type { Arrayable, GraphQlData, Undefineable, RelayNode } from ".."

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

export type ProductCollection = GraphQlData<'allCollections', Arrayable<BaseProductCollection>>

export type ProductCollectionNodes = RelayNode<BaseProductCollection>
