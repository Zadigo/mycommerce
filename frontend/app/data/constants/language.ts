import type { BaseCountries, Languages } from '~/types'

export const countries = [
  'France',
  'Guadeloupe',
  'Martinique',
  'Réunion'
] satisfies readonly BaseCountries[]


export const availableLocales = ['fr', 'en', 'es'] satisfies readonly Languages[]
