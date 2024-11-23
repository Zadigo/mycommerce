import type { Product } from "./shop";

export type UserSelection = {
    id: number | null;
    product: Product | object;
    size: number | string | null;
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
    quantity: number;
    total: number;
}

export interface CartUpdateAPIResponse {
    session_id: string;
    results: CartItem[];
    statistics: CartStatistic[];
    total: number;
}

export interface ProductToEdit extends CartStatistic {
    product_info: CartItem | undefined
}
