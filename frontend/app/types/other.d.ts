import type { LocationQuery, RouteParamsRawGeneric } from 'vue-router'
import type { DefaultClotheSize, DefaultPriceFilters, DefaultSortingFilters } from '~/types/constants'

export interface ExtendedLocationQuery extends LocationQuery {
  login?: string
}

export interface CollectionFetchOptions {
  sorted_by: DefaultSortingFilters
  offset: string
  limit: string
  price: DefaultPriceFilters
  sizes: DefaultClotheSize
}

type ExtendedRouteParamsRawGeneric = RouteParamsRawGeneric & {
  id: string
}
