import type { BaseImage, ProductImage } from "~/types"

/**
 * Composable used to associate images with products
 * @param currentImages - The images to associate with the product
 */
const [useImageAssociation, _provideImageAssociation] = createInjectionState((currentImages: Ref<BaseImage[]>) => {
  const images = toRef(currentImages)
  const selectedImages = ref<BaseImage[]>([])
  const selectionCount = computed(() => selectedImages.value.length)

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

  async function unlink(image: BaseImage) {
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
  
  /**
   * Selection
   */

  function select(image: BaseImage) {
    const index = selectedImages.value.findIndex(i => i.id === image.id)
    if (index === -1) {
      selectedImages.value.push(image)
    } else {
      selectedImages.value.splice(index, 1)
    }
  }

  const isSelected = reactify((image: BaseImage) => selectedImages.value.some(i => i.id === image.id))

  const [showModal, toggle] = useToggle()

  return {
    /**
     * The number of selected images to associate with the product
     */
    selectionCount,
    /**
     * The state of the image association modal
     */
    showModal,
    /**
     * The product to associate the images with
     */
    productToAssociate,
    /**
     * The selected images to associate with the product
     */
    selectedImages,
    /**
     * Function used to toggle the image association modal
     */
    toggle,
    /**
     * Function used to unlink the the selected image from the given
     * product
     */
    unlink,
    /**
     * Function used to associate the selected images with the given product
     */
    associate,
    /**
     * Function used to select/deselect an image for association with the given product
     */
    select,
    /**
     * Function used to check if an image is selected for association with the given product
     */
    isSelected,
  }
})

export { useImageAssociation }

export function provideImageAssociation() {
  const store = _provideImageAssociation()
  if (!store) {
    throw new Error('useImageAssociation must be used within a provider')
  }
  return store
}
