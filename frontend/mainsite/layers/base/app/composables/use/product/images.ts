import type { BaseImage } from '~/types'

/**
 * Composable for handling image selection and modal display
 */
const [useImageZoomComposable, _useImageZoomComposableStore] = createInjectionState(() => {
  const [showModal, toggleShowModal] = useToggle()

  if (import.meta.server) {
    return {
      showModal,
      selectedImage: ref<BaseImage | null | undefined>(),
      handleCloseSelection: toggleShowModal,
      selectImage: (_image: BaseImage, _successCallback?: () => void) => { }
    }
  }

  const selectedImage = ref<BaseImage | null | undefined>()

  function selectImage(image: BaseImage, successCallback?: () => void) {
    showModal.value = true
    selectedImage.value = image
    
    if (isDefined(successCallback)) {
      successCallback()
    }
  }

  return {
    showModal,
    selectedImage,
    /**
     * Closes the image modal
     */
    handleCloseSelection: toggleShowModal,
    /**
     * Selects and image and opens the images modal
     * @param image The image to select
     * @param successCallback Callback function to be used
     */
    selectImage
  }
})

export { useImageZoomComposable }

export function useImageZoomComposableStore() {
  const store = _useImageZoomComposableStore()
  if (!store) throw new Error('useImageZoomComposableStore must be used after useImageZoomComposable')
  return store
}
