import type { Nullable, Product } from '~/types'

export const useProductStore = defineStore('product', () => {
  const currentProduct = ref<Nullable<Product>>(null)

  const router = useRouter()
  function setProduct(product: Nullable<Product>) {
    currentProduct.value = product
    router.push('/product')
  }

  return {
    currentProduct,
    setProduct
  }
})
