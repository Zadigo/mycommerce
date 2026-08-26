export type Size = {
  name: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | (string & {})
}

export type Material = {
  name: 'Coton' | 'Polyester' | 'Laine' | (string & {})
}

export type BaseProductFilters = {
  name: string
  values: Size[] | Material[]
}

export type ProductFilterskeys = 'sizes' | 'materials'

export type ProductFilters = GraphQlData<'productFilters', BaseProductFilters[]>

export type ProductFiltersSelection = {
  sizes: Size['name'][]
  materials: Material['name'][]
}
  