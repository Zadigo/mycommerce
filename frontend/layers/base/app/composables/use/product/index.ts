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
