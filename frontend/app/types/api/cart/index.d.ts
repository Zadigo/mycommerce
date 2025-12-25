export * from './address'
export * from './payment'

// import type { DefaultClotheSize } from '~/data/constants/constants'
// import type { Nullable, ProductNode } from '../..'
// import type { Product } from '../shop'

// /**
//  * The options selected by the user for the
//  * product that he wants to add to his cart 
//  */
// export type UserSelection = {
//   id: Nullable<number>
//   product: ProductNode | object
//   size: DefaultClotheSize
//   /**
//    * @default 1
//    */
//   quantity: number
//   session_id: Nullable<string>
// }

// export type AddToCartData = {
//   product: Pick<Product, 'id' | 'color'>
//   size: DefaultClotheSize
//   session_id: string
// }

// export type ProductForCart = Omit<Product, 'variants'>

// // export interface CartItem {
// //   id: number
// //   product: ProductForCart
// //   size: DefaultClotheSize
// //   price: string | number
// //   created_on: string
// // }

// interface CartStatistic {
//   /**
//    * ID of the specific product
//    */
//   product__id: number
//   /**
//    * Name of the specific product
//    */
//   product__name: string
//   /**
//    * Selected size for the specific product
//    * @default "Unique"
//    */
//   size: DefaultClotheSize
//   /**
//    * Number of times the specific product appears in the cart
//    * @default 0
//    */
//   quantity: number
//   /**
//    * Total sum of the specific product in the cart
//    * @description If the cart contains 2 products (id: 1, name: "Product 1") priced at 10, the total will be 20
//    * @default 0
//    */
//   total: number
// }

// export interface CartUpdateApiResponse {
//   /**
//    * Session ID used to identify the user's cart
//    * @description This ID is generated when the user first visits the site and is stored in a cookie and is used
//    * more specifically identify anonymous users when they add products to the cart
//    */
//   session_id: string
//   /**
//    * List of all products in the cart
//    * @default []
//    */
//   results: CartItem[]
//   /**
//    * Statistics about the products in the cart
//    * @description Each product will appear only once with its respective quantity and total
//    * @default []
//    */
//   statistics: CartStatistic[]
//   /**
//    * Total sum of all products in the cart
//    * @description If the cart contains 2 products priced at 10 and 20, the total will be 30
//    * @default 0
//    */
//   total: number
// }

// /**
//  * A modified object of the cart results which allows
//  * edition and quick selection of information
//  */
// export interface ProductToEdit extends CartStatistic {
//   product_info: CartItem | undefined
// }
