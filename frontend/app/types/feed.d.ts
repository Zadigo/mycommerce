import type { DefaultColors, DefaultPriceFilters, DefaultSortingFilters, DefaultClotheSize } from '~/types/constants'

/**
 * Default object containining the selections to
 * filter products in the feed 
 */
export interface SelectedFilters {
  sorted_by: DefaultSortingFilters
  typology: string[]
  colors: DefaultColors[]
  sizes: DefaultClotheSize[]
  price: DefaultPriceFilters | null
}

interface LimitOffset {
  offset: number
  limit: number
}

export interface ProductsQuery extends SelectedFilters, Partial<LimitOffset> { /** */ }
