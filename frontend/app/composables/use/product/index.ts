import type { MaybeType } from '~/types'
import type { ProductNode } from '~/types/graphql'

export * from './images'
export * from './items'
export * from './stock'
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
