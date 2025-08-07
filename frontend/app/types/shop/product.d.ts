export type ProductSizes = {
  id: number;
  name: DefaultClotheSize;
  availability: boolean;
};

declare type ProductSet = {
  id: number;
  name: string;
  color: string
  color_variant_name: string
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
  illustration: string | null;
  tags: string[] | null;
  get_view_name: string;
};

/**
 * Base object representing a product in
 * for the e-commerce website 
 */
export type Product = {
  id: number;
  name: string;
  color: string;
  category: string;
  sub_category: string;
  sizes: ProductSizes[];
  has_sizes: boolean;
  unit_price: string
  get_price: string;
  sale_value: number;
  sale_price: string;
  on_sale: boolean;
  display_new: boolean
  collection_set: ProductCollection[] | null;
  get_main_image: ProductImage;
  images: ProductImage[];
  model_height: string
  model_size: string
  color_variant_name: string;
  is_new: boolean;
  active: boolean;
  display_new: boolean;
  slug: string;
  sku: string
  variants: ProductVariant[]
  modified_on: string;
  created_on: string;
};
