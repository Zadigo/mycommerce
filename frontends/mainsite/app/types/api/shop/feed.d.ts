// import type { DefaultClotheSize, DefaultColors, DefaultPriceFilters } from '~/data/constants/constants'
import type { Empty } from '../..'


interface LimitOffset {
  offset: Empty<number>
  limit: Empty<number>
}

/**
 * Default object containining the selections to
 * filter products in the feed 
 */
export type SelectedFilters = {
  sorted_by: SortingFilter
  typology: string[]
  colors: DefaultColors[]
  sizes: DefaultClotheSize[]
  price: DefaultPriceFilters | null
} & LimitOffset

export type LocationProductsQuery = Partial<Omit<SelectedFilters, 'typology'>> & { typology?: string }
