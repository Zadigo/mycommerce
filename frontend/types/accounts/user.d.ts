import type { AddressSet } from "./shipping";

export type UserProfile = {
  id: number;
  stripe_id: string;
  address_set: AddressSet[];
};

/**
 * Data for an authenticated user profile 
 */
export type Profile = {
  id: number;
  userprofile: UserProfile;
  first_name: string;
  last_name: string;
  get_full_name: string;
  username: string;
  email: string;
};
