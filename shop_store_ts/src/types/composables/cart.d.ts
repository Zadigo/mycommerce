import { Product } from "../shop";

export type UserSelection = {
  id: number | null;
  size: string | null;
  quantity: number | null;
  product: Product | object;
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
