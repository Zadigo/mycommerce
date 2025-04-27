export * from './address'
export * from './payment'

import type { Product } from "../shop";

/**
 * The options selected by the user for the
 * product that he wants to add to his cart 
 */
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

/**
 * A modified object of the cart results which allows
 * edition and quick selection of information
 */
export interface ProductToEdit extends CartStatistic {
    product_info: CartItem | undefined
}

export interface DeliveryOption {
    id: string
    name: string
    description: string
    estimated_arrival_time: null
    default: boolean
    shipping_cost: string | number
    selected: boolean
    is_relais: boolean
    is_home: boolean
    is_store: boolean
    is_inpost: boolean
    is_managed_by_kbrw: boolean
    is_cash_on_delivery: boolean
    is_tAH: boolean
    estimated_delivery_date: {
        delivery_date: string
        minDelivery_date: string
        maxDelivery_date: string
    }
    shipping_cost_value: number
    shop_runback_values: {
        is_link_order_return_active: boolean
        order_return_type: {}
        order_return_link: string | null
        order_return_number_of_day: number
        url: string
    }
}
