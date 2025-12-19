import type { BaseImage } from '~/types'

/**
 * Composable for handling image selection and modal display
 */
const [useImageZoomComposable, _useImageZoomComposableStore] = createInjectionState(() => {
  if (import.meta.server) {
    return {
      showModal: ref(false),
      selectedImage: ref<BaseImage | null | undefined>(),
      toggleShowModal: () => { },
      handleCloseSelection: () => { },
      handleSelectedImage: (_image: BaseImage) => { },
      selectImage: (_image: BaseImage, _fn: () => void) => { }
    }
  }

  const { vueApp } = useNuxtApp()

  const [showModal, toggleShowModal] = useToggle()
  const selectedImage = ref<BaseImage | null | undefined>()

  /**
   * Selects and image and opens the images modal
   * @param image The image to select
   * @param fn Callback function to be used
   */
  function selectImage(image: BaseImage, fn: () => void) {
    showModal.value = true
    selectedImage.value = image
    fn.call(vueApp)
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
    toggleShowModal,
    handleCloseSelection,
    selectImage
  }
})

export { useImageZoomComposable }

export function useImageZoomComposableStore() {
  const store = _useImageZoomComposableStore()
  if (!store) throw new Error('useImageZoomComposableStore must be used after useImageZoomComposable')
  return store
}
