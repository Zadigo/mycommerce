import type { Product } from '~/types'
import type { Refable, Undefineable } from '~/types'

export * from './images'

type ImageComponentMap = Record<number, Component>

/**
 * Composable for selecting the appropriate image component
 * based on the number of images a product has.
 * @param product - The product to determine the image component for
 */
export function useImageComponentComposable(product: Refable<Undefineable<Product>>) {
  const FiveImages = defineAsyncComponent(() => import('~/components/product/page/images/Five.vue'))
  const SixImages = defineAsyncComponent(() => import('~/components/product/page/images/Six.vue'))
  const NoImages = defineAsyncComponent(() => import('~/components/product/page/images/Empty.vue'))

  const imageComponentMap: ImageComponentMap = {
    5: FiveImages,
    6: SixImages
  }

  const imagesComponent = computed((): Component => {
    if (!isDefined(product)) {
      return NoImages
    } else if (product && product.value.images.length === 0) {
      return NoImages
    } else {
      const numberOfImages = product.value.images.length
      return imageComponentMap[numberOfImages] || NoImages
    }
  })

  return {
    /**
     * The image component to use based on the number of images the product has.
     * @default NoImages
     */
    imagesComponent
  }
}
