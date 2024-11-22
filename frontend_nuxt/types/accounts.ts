export type AddressSet = {
    id: number;
    firstname: string;
    lastname: string;
    address_line: string;
    zip_code: number;
    country: string;
    city: string;
    telephone: string | null;
    gender: string;
    is_active: boolean;
    created_on: string;
};

export type UserProfile = {
    id: number;
    stripe_id: string;
    address_set: AddressSet[];
};

export type Profile = {
    id: number;
    userprofile: UserProfile;
    first_name: string;
    last_name: string;
    get_full_name: string;
    username: string;
    email: string;
};

export interface User {
    id: number
    userprofile: Profile
    first_name: string
    last_name: string
    get_full_name: string
    username: string
    email: string
}

export interface LoginAPIResponse {
    access: string
    refresh: string
}
