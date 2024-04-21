import _ from 'lodash'
import { defineStore } from 'pinia'

export const useShop = defineStore('shop', {
  state: () => ({
    products: [],
    images: [],
    // products: [
    //   {
    //     id: 1,
    //     produdct_id: 'prod_zenfzeino',
    //     name: "Blazer Strapped",
    //     color: "Red",
    //     unit_price: 302,
    //     active: true,
    //     display_new: false,
    //     slug: "blazer-strapped",
    //     category: "Panties",
    //     created_on: "2022-03-18",
    //     modified_on: "2022-03-18",
    //     sale_value: 36,
    //     on_sale: true
    //   },
    //   {
    //     id: 2,
    //     produdct_id: 'prod_zenfzeino',
    //     name: "Blazer Strapped 2",
    //     color: "Red",
    //     unit_price: 302,
    //     active: true,
    //     display_new: false,
    //     slug: "blazer-strapped",
    //     category: "Panties",
    //     created_on: "2022-03-18",
    //     modified_on: "2022-03-18",
    //     sale_value: 36,
    //     on_sale: true
    //   },
    //   {
    //     id: 3,
    //     produdct_id: 'prod_zenfzeino',
    //     name: "Blazer Strapped 3",
    //     color: "Red",
    //     unit_price: 302,
    //     active: true,
    //     display_new: false,
    //     slug: "blazer-strapped",
    //     category: "Panties",
    //     created_on: "2022-03-18",
    //     modified_on: "2022-03-18",
    //     sale_value: 36,
    //     on_sale: true
    //   }
    // ],
    currentProduct: {},
    currentImage: {}
  }),
  getters: {
    previousProductId () {
      const currentIndex = _.findIndex(this.products, { id: this.currentProduct.id })
      const newIndex = currentIndex - 1
      if (newIndex < 0) {
        console.log(this.products.length)
        return this.products[this.products.length - 1]
      } else {
        return this.products[newIndex]
      }
    },
    nextProductId () {
      const currentIndex = _.findIndex(this.products, { id: this.currentProduct.id })
      const newIndex = currentIndex + 1
      if (newIndex >= this.products.length) {
        return this.products[0]
      } else {
        return this.products[newIndex]
      }
    }
  },
  actions: {
    setCurrentProduct (id) {
      this.currentProduct = _.find(this.products, { id: id * 1 })
    },
    setCurrentImage (id) {
      this.currentImage = _.find(this.images, { id: id * 1 })
    }
  }
})
