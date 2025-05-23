import type { Product } from "./shop";

export type UserSelection = {
    id: number | null;
    product: Product | object;
    size: number | string | null | undefined;
    quantity: number | 1;
    session_id: string | null;
};

export type AddToCartData = {
    product: {
        id: number;
        color: string;
    };
    size: string;
    session_id: string;
};

export interface CartItem {
    id: number;
    product: Product;
    size: string | null;
    price: number;
    created_on: string;
}

interface CartStatistic {
    product__id: number;
    product__name: string;
    size: string
    quantity: number;
    total: number;
}

export interface CartUpdateApiResponse {
    session_id: string;
    results: CartItem[];
    statistics: CartStatistic[];
    total: number;
}

// A modified object of the cart results which allows
// edition and quick selection of information
export interface ProductToEdit extends CartStatistic {
    product_info: CartItem | undefined
}

export interface DeliveryOption {
    id: number
    name: string
}
