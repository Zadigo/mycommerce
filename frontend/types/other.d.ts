import type { LocationQuery } from "vue-router";
import type { DefaultClotheSize, DefaultPriceFilters, DefaultSortingFilters } from "~/data";
import type { FetchOptions } from 'ofetch'
import type { RouteParamsRawGeneric } from 'vue-router'

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
