import type { Arrayable, ClotheSizes } from '~/types'

export type FilterActions = 'sorted by' | 'typology' | 'colors' | 'sizes' | 'price'

export const filterBySorting = [
  ['New', 'Nouveautés'],
  ['Price up', 'Prix croissant'],
  ['Price down', 'Prix décroissant']
]

export const filterByClotheSize = ['XS', 'S', 'M', 'L', 'XL'] satisfies readonly ClotheSizes[]

export type PriceFilter = "Jusqu'à 15€" | "Jusqu'à 20€" | "Jusqu'à 25€" | "Jusqu'à 30€" | "Jusqu'à 35€" | "Jusqu'à 50€"

export const filterByPrice: Arrayable<{ text: string, value: PriceFilter }> = [
  {
    text: "Jusqu'à 15€",
    value: "Jusqu'à 15€" 
  },
  {
    text: "Jusqu'à 20€",
    value: "Jusqu'à 20€" 
  },
  {
    text: "Jusqu'à 25€",
    value: "Jusqu'à 25€" 
  },
  {
    text: "Jusqu'à 30€",
    value: "Jusqu'à 30€" 
  },
  {
    text: "Jusqu'à 35€",
    value: "Jusqu'à 35€" 
  },
  {
    text: "Jusqu'à 50€",
    value: "Jusqu'à 50€" 
  }
]
