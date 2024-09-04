import { Product } from '@/types/collections'
import _ from 'lodash'
import { defineStore } from 'pinia'

type Cache = {
  statistics: object
}

type State = {
  requestData: {
    session_id: string;
    firstname: string;
    lastname: string;
    email: string;
    telephone: string;
    address_line: string;
    zip_code: string;
    country: string;
    city: string;
    delivery: string;
    card_token: string;
  };

  cache: Cache;
  products: Product[];

  showAddedProductDrawer: boolean;
  showEditProductDrawer: boolean;
  showCartDrawer: boolean;
};


const useCart = defineStore("cart", {
  state: (): State => ({
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
        return _.sum(_.map(this.cache.statistics, (item) => item.quantity));
      } else {
        return 0;
      }
    },
    /**
     * The last product that was added to
     * the user's cart. This is mainly for
     * the dialog that shows the last product
     * that was added to the cart
     *
     * @returns {Object} The last product object
     */
    lastAddedProduct(): Product {
      return _.last(this.products) || {};
    },
    /**
     * Calculate the cart total dynamically which is
     * the amount of similar products that were added
     * to the cart multiplied by their respective prices
     */
    cartTotal(): number {
      if (this.hasProducts) {
        return _.sum(_.map(this.cache.statistics, (item) => item.total));
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
    loadFromCache(): void {
      this.products = this.$session.retrieve("cart") || [];
      this.cache = this.$session.retrieve("cart_cache") || {};
    },
    /**
     * This is the main function that adds a product to
     * the user's cart in the store. When the product
     * does not exist, it is created otherwise, its quantity
     * is upgraded
     *
     * @param {Object} data The server response object
     * @param {Object[]} data.results An array of cart objects
     * @param {Object[]} data.statistics An array of object information
     */
    updateCart(data): void {
      this.cache = data;
      this.products = data.results;
    },
    /**
     * Removes a product entirely from the cart
     * regardless of quantity
     */
    removeFromCart(product: Product) {
      const index = _.findIndex(this.products, { id: product.id });
      this.products.splice(index, 1);
    },
  },
});

export {
  useCart
}
