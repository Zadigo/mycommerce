import { Product } from 'app/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

const useShop = defineStore('shop', () => {
  const products = ref<Product[]>([])

  return {
    products
  }
})

export { useShop }
