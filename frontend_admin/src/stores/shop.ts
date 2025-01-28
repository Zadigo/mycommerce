import { Product, ProductImage } from '../types'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const useShop = defineStore('shop', () => {
  const products = ref<Product[]>([])
  const images = ref<ProductImage[]>([])

  const currentProduct = ref<Product>()
  const currentImage = ref<ProductImage | undefined>()

  const currentProductIndex = computed(() => {
    if (currentProduct.value) {
      return products.value.findIndex((x) => {
        if (currentProduct.value) {
          return x.id === currentProduct.value.id
        } else {
          return false
        }
      })
    } else {
      return -1
    }
  })

  const previousProduct = computed(() => {
    if (currentProductIndex.value === -1) {
      return products.value[products.value.length]
    } else {
      return products.value[currentProductIndex.value]
    }
  })

  const nextProduct = computed(() => {
    if (currentProductIndex.value === -1) {
      return products.value[0]
    } else {
      return products.value[currentProductIndex.value]
    }
  })

  return {
    images,
    currentProduct,
    currentImage,
    previousProduct,
    nextProduct,
    products
  }
})

export { useShop }
