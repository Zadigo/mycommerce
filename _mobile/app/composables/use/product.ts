// import type { Nullable, Product } from "~/types"

// const [useProviderProduct, useProductStore] = createInjectionState((products: Product[]) => {
//   const router = useRouter()
//   const _products = ref<Product[]>(products || [])
//   const currentProduct = ref<Nullable<Product>>(null)
//   function setProduct(product: Product) {
//     currentProduct.value = product
//     router.push('/product')
//   }

//   return {
//     currentProduct,
//     setProduct
//   }
// })

// export { useProductStore, useProviderProduct }
