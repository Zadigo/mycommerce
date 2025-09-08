import type { DefaultClotheSize } from './measurements'

export const defaultColors = [
  'Bleu',
  'Rose',
  'Vert',
  'Marron',
  'Beige',
  'Orange',
  'Gris',
  'Noir',
  'Rouge',
  'Kaki',
  'Blanc',
  'Jaune',
  'Violt'
] as const

export type DefaultColors = (typeof defaultColors)[number] | (string & {})

export interface DefaultSizes {
  clothes: DefaultClotheSize[]
}

export const defaultSortingFilters = ['Nouveautés', 'Prix croissant', 'Prix décroissant'] as const

/**
 * Default options for filtering a product by price
*/
export type DefaultSortingFilters = (typeof defaultSortingFilters)[number]

export const defaultSortingFilterActions = ['New', 'Price up', 'Price down'] as const

export type DefaultSortingFilterActions = (typeof defaultSortingFilterActions)[number]

export const priceFilter = [
  "Jusqu'à 15€",
  "Jusqu'à 20€",
  "Jusqu'à 25€",
  "Jusqu'à 30€",
  "Jusqu'à 35€",
  "Jusqu'à 50€"
] as const

/**
 * Default options for filtering products up to
 * a given price e.g. product <= $15 
 */
export type DefaultPriceFilters = (typeof priceFilter)[number]

/**
 * The default price filters with their corresponding values
 * to be used in the API queries
 */
export const defaultPriceFilters: { text: DefaultPriceFilters, value: string }[] = [
  {
    text: "Jusqu'à 15€",
    value: 'Up to 15'
  },
  {
    text: "Jusqu'à 20€",
    value: 'Up to 20'
  },
  {
    text: "Jusqu'à 25€",
    value: 'Up to 25'
  },
  {
    text: "Jusqu'à 30€",
    value: 'Up to 30'
  },
  {
    text: "Jusqu'à 35€",
    value: 'Up to 40',
  },
  {
    text: "Jusqu'à 50€",
    value: 'Up to 50'
  }
] as const

export const sortingFilterActions: (DefaultSortingFilterActions | DefaultSortingFilters)[][] = [
  ['New', 'Nouveautés'],
  ['Price up', 'Prix croissant'],
  ['Price down', 'Prix décroissant']
] as const

export type Actions = 'sorted by' | 'typology' | 'colors' | 'sizes' | 'price'
