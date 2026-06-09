import type { ProductImage } from "~/types"

/**
 * Composable used to associate images with products
 * @param currentImages - The images to associate with the product
 */
export function useImageAssociation(currentImages: Ref<ProductImage['data']['allImages']>) {
  const images = toRef(currentImages)
  const selectedImages = ref<ProductImage['data']['allImages']>([])

  const productToAssociate = ref<number>()

  async function associate() {
    await $fetch('/images/associate', {
      method: 'POST',
      baseURL: useRuntimeConfig().public.prodDomain,
      body: {
        product: productToAssociate.value,
        images: selectedImages.value
      }
    })
  }

  /**
 * Unlink the the selected image from the given
 * product
 */
  async function unlink(image: ProductImage['data']['allImages'][number]) {
    const data = await $fetch<ProductImage[]>('admin/images/associate', {
      method: 'PATCH',
      baseURL: useRuntimeConfig().public.prodDomain,
      body: {
        product: productToAssociate.value,
        image: image.id,
        method: 'Dissociate'
      }
    })

    if (data) {
      // Do something
    }
  }

  const [showModal, toggle] = useToggle()

  return {
    showModal,
    productToAssociate,
    selectedImages,
    toggle,
    unlink,
    associate
  }
}
