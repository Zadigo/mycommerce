import type { DefaultCountries } from '~/types/constants'
import type { _DatabaseObject } from '../..'

export type DefaultGender = 'Homme' | 'Femme'

/**
 * Represents shipping information for a
 * given user 
 */
export type AddressSet = _DatabaseObject & {
  firstname: string
  lastname: string
  address_line: string
  zip_code: number
  country: DefaultCountries
  city: string
  telephone: string
  gender: DefaultGender
  is_active: boolean
  created_on: string
}
