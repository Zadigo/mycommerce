import type { DefaultClotheSize, DefaultSortingFilters, DefaultPriceFilters, DefaultColors } from "~/data/constants"

export interface DefaultPriceFilters {
    text: PriceFilter
    value: string
}

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

/**
 * An object that represents the final dictionnary that
 * will be used to create the query that will be used
 * to send to the Django backend
 * TODELETE: We might not need this anymore?? 
 */
export interface ProductsQuery extends SelectedFilters {
    typology: string
    colors: string
    sizes: string
    offset: string | number
    limit?: string | number
}
