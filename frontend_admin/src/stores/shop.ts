import { Product, ProductImage } from '../types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

const useShop = defineStore('shop', () => {
  const products = ref<Product[]>([])
  const images = ref<ProductImage[]>([])

  const previousProductId = ref<Product>()
  const nextProductId = ref<Product>()

  const currentProduct = ref<Product>()
  const currentImage = ref<ProductImage | undefined>()

  return {
    images,
    currentProduct,
    currentImage,
    previousProductId,
    nextProductId,
    products
  }
})

export { useShop }
