import type { ProductImage } from '~/types'

/**
 * Composable for handling image selection and modal display
 */
export function useImagesComposable() {
  if (import.meta.server) {
    return {
      showModal: ref(false),
      selectedImage: ref<ProductImage | null | undefined>(),
      handleCloseSelection: () => { },
      handleSelectedImage: (_image: ProductImage) => { },
      selectImage: (_image: ProductImage, _fn: () => void) => { }
    }
  }

  const { vueApp } = useNuxtApp()

  const showModal = ref<boolean>(false)
  const selectedImage = ref<ProductImage | null | undefined>()

  /**
   * Selects and image and opens the images modal
   * @param image The image to select
   * @param fn Callback function to be used
   */
  function selectImage(image: ProductImage, fn: () => void) {
    showModal.value = true
    selectedImage.value = image
    fn.call(vueApp)
  }

  /**
   * Selects an image within a group of images
   * @param image The selected image
   * @deprecated
   */
  function handleSelectedImage(image: ProductImage) {
    selectedImage.value = image
    showModal.value = true
  }

  /**
   * Closes the image modal
   */
  function handleCloseSelection() {
    showModal.value = false
  }

  return {
    showModal,
    selectedImage,
    handleCloseSelection,
    handleSelectedImage,
    selectImage
  }
}
