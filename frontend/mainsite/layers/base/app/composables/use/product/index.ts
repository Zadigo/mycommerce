import type { ExtendedRouteParamsRawGeneric, MaybeType } from '~/types'
import type { ProductNode } from '~/types/graphql'

export * from './images'
export * from './items'
export * from './utils'
export * from './ws_manager'

/**
 * Composable for selecting the appropriate image component
 * based on the number of images a product has.
 * @param product - The product to determine the image component for
 */
export function useImageComponentComposable(product: MaybeType<ProductNode>) {
  const DefaultImage = defineAsyncComponent(() => import('~/components/product/page/images/Default.vue'))
  const FiveImages = defineAsyncComponent(() => import('~/components/product/page/images/Five.vue'))
  const SixImages = defineAsyncComponent(() => import('~/components/product/page/images/Six.vue'))
  const NoImages = defineAsyncComponent(() => import('~/components/product/page/images/Empty.vue'))

  const imageComponentMap: Record<number, Component> = {
    3: DefaultImage,
    4: DefaultImage,
    5: FiveImages,
    6: SixImages
  }

  const _product = toValue(product)
  const imagesComponent = computed((): Component => isDefined(_product) ? imageComponentMap[_product.node.productImages.length] || NoImages : NoImages)

  return {
    /**
     * The image component to use based on the number of images the product has.
     * @default NoImages
     */
    imagesComponent
  }
}

/**
 * Composable for fetching product details.
 * This composable fetches the product details from the API
 * and returns it as a reactive state.
 */
const [useProductDetailsComposable, _useProductDetailsComposableStore] = createInjectionState(async () => {
  const { id } = useRoute().params as ExtendedRouteParamsRawGeneric

  const { data: product, status } = await useFetch<ProductNode>(`/api/products/${id}`, {
    method: 'GET',
    immediate: true,
    onResponseError({ error }) {
      createError({
        statusMessage: error?.message,
        statusCode: 404
      })
    }
  })

  const isLoading = computed(() => status.value !== 'success')
  const numberOfImages = computed(() => isDefined(product) ? product.value.node.productImages.length : 0)
  const hasColorVariants = computed(() => isDefined(product) ? product.value.node.colorVariants.length > 0 : false)

  return {
    /**
     * Product data fetched from the API
     * @default undefined
     */
    product,
    /**
     * Whether the product is currently being loaded
     * @default true
     */
    isLoading,
    /**
     * Number of images associated with the product
     * @default 0
     */
    numberOfImages,
    /**
     * Whether the product has color variants
     * @default false
     */
    hasColorVariants
  }
})

export { useProductDetailsComposable }

export function useProductDetailsComposableStore() {
  const store = _useProductDetailsComposableStore()
  if (!isDefined(store)) {
    throw new Error('useProductDetailsComposableStore must be used within a useProductDetailsComposable context')
  }
  return store
}

/**
 * Composable that allows a component to fetch product details on demand, rather than immediately when the component is mounted.
 * This is useful for scenarios where you want to fetch product details in response to a user action, such as clicking on a product in a feed.
 * The composable provides a method to set the product data directly, as well as a method to fetch the product data from the API using the product ID.
 * The composable also provides computed properties for the number of images and whether the product has color variants, similar to the useProductDetailsComposable.
 * @returns An object containing the product data, number of images, whether the product has color variants, and methods to set and fetch the product data.
 * @example
 * const { product, numberOfImages, hasColorVariants, setProduct, fetchProduct } = useDelayedProductDetailComposabled()
 * // To set product data directly
 * setProduct(productData)
 * // To fetch product data from the API
 * fetchProduct(productId)
 */
export const useDelayedProductDetailComposable = createGlobalState(() => {
  const product = ref<ProductNode>()

  function setProduct(newProduct: ProductNode) {
    product.value = newProduct
  }

  async function fetchProduct(id: string) {
    const data = await $fetch<ProductNode>(`/api/products/${id}`, {
      method: 'GET',
      onResponseError({ error }) {
        createError({
          statusMessage: error?.message,
          statusCode: 404
        })
      }
    })

    product.value = data
  }

  const numberOfImages = computed(() => isDefined(product) ? product.value.node.productImages.length : 0)
  const hasColorVariants = computed(() => isDefined(product) ? product.value.node.colorVariants.length > 0 : false)

  return {
    /**
     * Product data fetched from the API
     * @default undefined
     */
    product,
    /**
     * Number of images associated with the product
     * @default 0
     */
    numberOfImages,
    /**
     * Whether the product has color variants
     * @default false
     */
    hasColorVariants,
    /**
     * Sets the product data
     * @param newProduct - The new product data
     */
    setProduct,
    /**
     * Fetches the product data from the API
     * @param id - The product ID
     */
    fetchProduct
  }
})
