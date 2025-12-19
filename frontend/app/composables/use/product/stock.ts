import { useErrorHandler } from '~/composables/errors'

import type { ProductNode, MaybeType, ProductStockApiResponse } from '~/types'

/**
 * Composable for fetching the stock state of a product.
 * This composable fetches the stock state of a product
 * from the API and returns it as a reactive state
 * @param product - The product to fetch the stock state for
 */
export function useProductStockComposable(product: MaybeType<ProductNode>, canRequest: Ref<boolean>) {
  if (import.meta.server) {
    return {
      stockState: ref<ProductStockApiResponse | null>(null)
    }
  }

  const currentProduct = toRef(product)

  if (!isDefined(currentProduct)) {
    // throw new Error('Product is required for useProductStockComposable')
    return {
      stockState: ref<ProductStockApiResponse | null>(null)
    }
  }

  // const { $client } = useNuxtApp()

  const { customHandleError } = useErrorHandler()
  const stockState = ref<ProductStockApiResponse | null>(null)

  const { execute, data } = useFetch<ProductStockApiResponse>(`/api/v1/stocks/products/${currentProduct.value.id}`, {
    method: 'GET',
    baseURL: useRuntimeConfig().public.prodDomain,
    immediate: false,
    onResponseError({ error }) {
      customHandleError(error)
    }
  })

  whenever(canRequest, async (canRequestValue) => {
    await execute()
    if (data.value) {
      stockState.value = data.value
    }
  })

  // onMounted(async () => {
  //   delay(2000)

  //   const response = await $client<ProductStockApiResponse>(`/api/v1/stocks/products/${currentProduct.id}`, {
  //     method: 'GET',
  //     baseURL: useRuntimeConfig().public.prodDomain,
  //     onResponseError({ error }) {
  //       customHandleError(error)
  //     }
  //   })
  //   stockState.value = response
  // })

  return {
    /**
     * Stock state of the product
     */
    stockState
  }
}
