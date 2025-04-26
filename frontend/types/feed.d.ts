export interface SelectedFilters {
    sorted_by: string,
    typology: string[],
    colors: string[],
    sizes: string[],
    price: string | null
}

export interface ProductsQuery extends SelectedFilters {
    typology: string
    colors: string,
    sizes: string,
    offset: string | number
    limit?: string | number
}
