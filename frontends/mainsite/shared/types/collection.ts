import type { GraphQlData, RelayEdge } from './graphql'
import type { BaseProduct } from './product'

export type BaseCollection = {
  id: string
  reference: string
  name: string
}

export type BaseCollectionProducts = BaseCollection & { products: BaseProduct[] }

export type Collection = GraphQlData<'collection', BaseCollection>

export type AllCollections = GraphQlData<'allCollections', BaseCollection[]>

export type CollectionProducts = GraphQlData<'collection', BaseCollectionProducts>

export type SearchCollection = GraphQlData<'searchCollection', RelayEdge<BaseCollection>>
