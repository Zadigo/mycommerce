import { ComputedRef, Ref } from "vue";

export type ProductSizes = {
  id: number;
  name: string;
  sub_category: string;
  availability: boolean;
};

type ProductSet = {
  id: number;
  name: string;
};

type ProductImage = {
  id: number;
  name: string;
  product_set: ProdcuctSet[];
  original: string;
  thumbnail: string;
  mid_size: string;
};

type ProductCollection = {
  id: number;
  name: string;
  category: string;
  sub_category: string;
  number_of_items: number;
  illustration: string;
  tags: string[];
  get_view_name: string;
};

type Product = {
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
  modified_on: string;
  created_on: string;
};

declare function useCollectionMockup(): {
  productCollections: ComputedRef<ProductCollection>;
};

declare function useMockups(): {
  mockupProducts: Ref<Product>;
  mockupProduct: Ref<Product>;

  getProduct(): Product;
  getRandomProduct(): Product;
};
