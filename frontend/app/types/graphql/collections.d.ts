import type { Arrayable, GraphQlData, Undefineable } from ".."

export interface BaseProductCollection {
	name: string
	viewName: string
	category: string
	description: string
	illustration?: Undefineable<string>
	numberOfItems: number
	slug: string
	subCategory: string
	subcategorySlug: string
	tags?: Arrayable<string>
	createdOn: string
}

export type ProductCollection = GraphQlData<'allCollections', Arrayable<BaseProductCollection>>
