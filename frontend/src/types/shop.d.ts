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
  product_set: ProdcuctSet[];
  original: string;
  thumbnail: string;
  mid_size: string;
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

export type Product = {
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

export type ProductsAPIResponse = {
  count: number
  next: string
  previous: string
  results: Product[]
}

export type LikedProducts = number[]
