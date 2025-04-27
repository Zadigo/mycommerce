export const countries = [
  "France",
  "Guadeloupe",
  "Martinique",
  "Réunion"
] as const

export type DefaultCountries = (typeof countries)[number]
