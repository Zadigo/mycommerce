import type { DefaultCountries } from "~/data";

export type DefaultGender = 'Homme' | 'Femme'

/**
 * Represents shipping information for a
 * given user 
 */
export type AddressSet = {
  id: number;
  firstname: string;
  lastname: string;
  address_line: string;
  zip_code: number;
  country: DefaultCountries;
  city: string;
  telephone: string | null;
  gender: DefaultGender;
  is_active: boolean;
  created_on: string;
};
