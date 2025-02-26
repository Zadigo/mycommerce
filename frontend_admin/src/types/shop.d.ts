import { SizeSubCategory } from './data'

export type ProductSizes = {
    id: number;
    name: string;
    sub_category: string;
    availability: boolean;
};

declare type ProductSet = {
    id: number;
    name: string;
};

export type ProductImage = {
    id: number;
    name: string;
    product_set: ProductSet[];
    original: string;
    thumbnail: string;
    mid_size: string;
    is_main_image: boolean;
};

export interface ProductVariant {
    id: number
    color: string
    get_main_image: ProductImage
    active: boolean
}

export type ProductCollection = {
    id: number;
    name: string;
    category: string;
    sub_category: string;
    number_of_items: number;
    illustration: string;
    tags: string[] | null;
    get_view_name: string;
};

export interface Product {
    id: number;
    name: string;
    color: string;
    category: string;
    sub_category: string;
    sizes: ProductSizes[];
    has_sizes: boolean;
    get_price: number;
    sale_value: number;
    sale_price: number;
    on_sale: boolean;
    collection_set: ProductCollection[];
    get_main_image: ProductImage;
    images: ProductImage[];
    color_variant_name: string;
    is_new: boolean;
    active: boolean;
    display_new: boolean;
    slug: string;
    variants: ProductVariant[]
    modified_on: string;
    created_on: string;
};

export interface NewProduct extends Pick<Product, 'name' | 'color' | 'category' | 'sub_category' | 'sale_value' | 'sale_price' | 'on_sale' | 'is_new' | 'active'> {
    unit_price: number
    model_height: number | null
    model_size: string | number | null
    sizes: [
        {
            name: string
            sub_category: SizeSubCategory
            availability: boolean
            active: boolean
        }
    ]
}

export type ProductsAPIResponse = {
    count: number
    next: string
    previous: string
    results: Product[]
}

export type LikedProducts = number[]

export declare interface CollectionName {
    id: number;
    name: string;
    category: string;
    sub_category: string;
    number_of_items: number;
    illustration: string | null;
    tags: string[] | null;
    get_view_name: string;
}
