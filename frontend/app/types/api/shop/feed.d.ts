import type { DefaultColors, DefaultPriceFilters, DefaultSortingFilters, DefaultClotheSize } from '~/data/constants/constants'
import type { Empty } from '../..'

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
  offset: Empty<number>
  limit: Empty<number>
}

export type ProductsQuery = Partial<SelectedFilters> & Partial<LimitOffset>
