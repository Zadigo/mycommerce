declare type AddressSet = {
  id: number;
  firstname: string;
  lastname: string;
  address_line: string;
  zip_code: number;
  country: string;
  city: string;
  telephone: string;
  gender: "1" | "2";
  is_active: boolean;
  created_on: string;
};

export declare type UserProfile = {
  id: number;
  stripe_id: string;
  address_set: AddressSet[];
}

export declare type User = {
  id: number;
  userprofile: UserProfile;
  first_name: string;
  last_name: string;
  get_full_name: string;
  username: string;
  email: string;
};

export interface AuthenticationAPIResponse {
  // token: string;
  // user: User;
  access: string
  refresh: string
}
