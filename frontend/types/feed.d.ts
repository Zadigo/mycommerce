import type { DefaultColors, DefaultPriceFilters, DefaultSortingFilters } from "~/data"

/**
 * Default object containining the selections to
 * filter products in the feed 
 */
export interface SelectedFilters {
    sorted_by?: DefaultSortingFilters
    typology?: string[]
    colors?: DefaultColors[]
    sizes?: DefaultClotheSize[]
    price?: DefaultPriceFilters | null
}

export interface ProductsQuery extends SelectedFilters {
    offset: number
    limit?: number
}
