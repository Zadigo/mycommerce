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
  unit_price: number
  get_price: number;
  sale_value: number;
  sale_price: number;
  on_sale: boolean;
  collection_set: ProductCollection[];
  get_main_image: ProductImage;
  images: ProductImage[];
  model_height: string
  model_size: string
  color_variant_name: string;
  is_new: boolean;
  active: boolean;
  display_new: boolean;
  slug: string;
  variants: ProductVariant[]
  modified_on: string;
  created_on: string;
}

export type APIResponse = {
  count: number;
  next: string;
  previous: string;
  results: Product[];
};

export type CartProduct = {
  id: number;
  product: Product;
  size: string;
  price: string | number;
  created_on: string;
};

export type Order = {
  id: number;
  reference: string;
  products: Product[];
  total: string;
  created_on: string;
};

export type CartCache = {
  id: number;
};

export type CartStatistics = {
  product__id: number;
  product__name: string;
  quantity: number;
  total: number;
};

export type AddToCartResponse = {
  session_id: string;
  results: CartProduct[];
  statistics: CartStatistics[];
  total: number;
};

export type LikedProducts = number[];