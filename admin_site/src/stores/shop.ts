import { Product, ProductImage } from 'app/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

const useShop = defineStore('shop', () => {
  const products = ref<Product[]>([])
  const currentProduct = ref<Product>()
  const previousProductId = ref<Product>()
  const nextProductId = ref<Product>()
  const images = ref<ProductImage[]>([])

  return {
    images,
    previousProductId,
    nextProductId,
    currentProduct,
    products
  }
})

export { useShop }
