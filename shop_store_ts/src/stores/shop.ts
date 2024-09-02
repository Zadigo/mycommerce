import _ from 'lodash';
import { defineStore } from 'pinia';
import { Product } from '../types/shop';

declare type RootState = {
  visitedProducts: number[];
  likedProducts: number[];
  showLanguageModal: boolean;
};

const useShop = defineStore("shop", {
  state: (): RootState => ({
    visitedProducts: [],
    likedProducts: [],

    showLanguageModal: false,
  }),
  actions: {
    /**
     * Adds the product to the list of
     * products that were historically
     * visited by the user in the store
     */
    addToHistory(product: Product): void {
      if (product) {
        this.visitedProducts.push(product.id);
      }
    },
    /**
     * Adds the product to the user's
     * wishlist on the frontend. The store has a main
     * subscription which allows the data to sync to
     * the local storage
     */
    addToWishlist(productId: number): void {
      if (!this.likedProducts.includes(productId)) {
        this.likedProducts.push(productId);
      }
    },
    /**
     * Removes the product to the user's
     * wishlist on the frontend
     *
     * @param {Object} product The product object
     */
    removeFromWishlist(productId: number) {
      const index = _.indexOf(this.likedProducts, productId);

      if (index >= 0) {
        this.likedProducts.splice(index, 1);
      }
    },
    loadFromCache(): void {
      this.likedProducts = this.$localstorage.retrieve("likedProducts");
      this.visitedProducts = this.$localstorage.retrieve("visitedProducts");
    },
  },
  getters: {
    /**
     * Returns the number of products that
     * were visited by the user for the
     * actual given session
     */
    numberOfVisitedProducts(): number {
      return this.visitedProducts.length;
    },
    /**
     * Returns the unique IDs of each products that
     * were visited by the user during his session
     */
    uniqueVisitedProductIds(): number[] {
      return _.uniq(this.visitedProducts);
    },
  },
});

export {
  useShop
};

