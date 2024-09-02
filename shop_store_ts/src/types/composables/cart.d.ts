import { Product } from "../shop";

export type UserSelection = {
  id: number;
  size: string;
  quantity: number;
  product: Product;
  session_id: string;
};

export type AddToCartData = {
  product: {
    id: number;
    color: string;
  };
  size: string;
  session_id: string;
};
