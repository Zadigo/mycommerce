//// @ts-nocheck <- Uncomment to stop check on the file
import { CartItem, CartUpdateAPIResponse } from '@/types/composables/cart';
import { defineStore } from 'pinia';
import { Product } from '../types/shop';

declare type RequestData = {
  session_id: string | null;
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  telephone: string | null;
  address_line: string | null;
  zip_code: string | null;
  country: string | null;
  city: string | null;
  delivery: string | null;
  card_token: string | null;
};

declare type RootState = {
  requestData: RequestData;
  cache: CartUpdateAPIResponse;
  products: CartItem[];

  showAddedProductDrawer: boolean;
  showEditProductDrawer: boolean;
  showCartDrawer: boolean;
};

const useCart = defineStore("cart", {
  state: (): RootState => ({
    requestData: {
      session_id: null,
      firstname: null,
      lastname: null,
      email: null,
      telephone: null,
      address_line: null,
      zip_code: null,
      country: null,
      city: null,
      delivery: "Chronopost",
      card_token: null,
    },

    cache: {},
    products: [],

    showAddedProductDrawer: false,
    showEditProductDrawer: false,
    showCartDrawer: false,
  }),
  getters: {
    /**
     * Indicates if the cart has products
     */
    hasProducts(): boolean {
      return this.products.length > 0;
    },
    /**
     * Counts the number of products in the cart
     * which can be the quantity of items stored
     * under each product
     */
    numberOfProducts(): number {
      if (this.hasProducts) {
        // return _.sum(_.map(this.cache.statistics, (item) => item.quantity));
        return this.cache.statistics.map(x => x.quantity).reduce((a, b) => a + b, 0)
      } else {
        return 0;
      }
    },
    /**
     * The last product that was added to
     * the user's cart. This is mainly for
     * the dialog that shows the last product
     * that was added to the cart
     */
    lastAddedProduct(): CartItem | null {
      if (this.products.length > 0) {
        return this.products[this.products.length - 1]
      } else {
        return null
      }
      // return _.last(this.products) || {};
      // return this.products[this.products.length - 1]
    },
    /**
     * Calculate the cart total dynamically which is
     * the amount of similar products that were added
     * to the cart multiplied by their respective prices
     *
     * @returns {Number} The total sum of the cart
     */
    cartTotal(): number {
      if (this.hasProducts) {
        // return _.sum(_.map(this.cache.statistics, (item) => item.total));
        return this.cache.statistics.map(x => x.total).reduce((a, b) => a + b, 0)
      } else {
        return 0;
      }
    },
    /**
     * Target that the customer must
     * attain in order to get free
     * delivery on his cart total
     */
    freeDeliveryTarget(): number {
      const difference = 50 - this.cartTotal;
      return difference < 0 ? 0 : difference;
    },
  },
  actions: {
    /**
     * Preload the cart from the session if we actually
     * have the data. This allows us then to dynamically
     * calculate the items that the user has selected
     */
    loadFromCache() {
      this.products = this.$session.retrieve("cart") || [];
      this.cache = this.$session.retrieve("cart_cache") || {};
    },
    /**
     * This is the main function that adds a product to
     * the user's cart in the store. When the product
     * does not exist, it is created otherwise, its quantity
     * is upgraded
     */
    updateCart(data: CartUpdateAPIResponse) {
      this.cache = data;
      this.products = data.results;
    },
    /**
     * Removes a product entirely from the cart
     * regardless of quantity
     */
    removeFromCart(product: Product) {
      // const index = _.findIndex(this.products, { id: product.id });
      const index = this.products.findIndex(x => x.id === product.id)
      this.products.splice(index, 1);
    },
  },
});

export {
  useCart
};

