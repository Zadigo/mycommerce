import type { _DatabaseObject } from '../..'
import type { AddressSet } from './shipping'

export type UserProfile = _DatabaseObject & {
  stripe_id: string
  address_set: AddressSet[]
}

/**
 * Data for an authenticated user profile 
 */
export type Profile = _DatabaseObject & {
  userprofile: UserProfile
  first_name: string
  last_name: string
  get_full_name: string
  username: string
  email: string
}
