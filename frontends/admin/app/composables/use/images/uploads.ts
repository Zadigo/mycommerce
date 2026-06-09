import type { BaseImage, ProductImage } from "~/types";

/**
 * Composable used to manage images
 */
export function useImageUploadComposable() {
  /**
   * Uploads
   */

  const fileNames = ref<string>()
  const files = ref<File[]>([])

  async function upload() {
    const formData = new FormData();

    files.value.forEach((file, i) => {
      formData.append(`file_names[${i}]`, fileNames.value);
    })

    files.value.forEach(file => {
      formData.append('files', file, file.name);
    })

    const newImages = await $fetch<ProductImage[]>('/admin/v1/images/upload', {
      method: 'POST',
      baseURL: useRuntimeConfig().public.prodDomain,
      body: formData
    })

    if (newImages) {
      images.value = newImages
    }
  }

  /**
   * Image selection
   */

  const selectedImages = ref<BaseImage[]>([])
  const numberOfSelectedImages = computed(() => selectedImages.value.length)

  function select(state: boolean, image: BaseImage) {
    console.log(state, image)
    if (state) {
      selectedImages.value.push(image)
    } else {
      selectedImages.value = selectedImages.value.filter((img) => img.id !== image.id)
    }
  }

  /**
   * Image actions
   */

  const enableProductAssociationButton = ref<boolean>(false)
  const hasSelectedImages = computed(() => selectedImages.value.length > 0)

  whenever(hasSelectedImages, (newValue) => {
    if (newValue) {
      enableProductAssociationButton.value = true
    } else {
      enableProductAssociationButton.value = false
    }
  })

  const columnDisplay = ref<boolean>(true)

  const [showModal, toggle] = useToggle<boolean>()

  return {
    /**
     * The files to upload
     */
    files,
    /**
     * Name to use for the files
     */
    fileNames,
    /**
     * Images that we seleted by the user
     */
    selectedImages,
    /**
     * Number of selected images
     * @default 0
     */
    numberOfSelectedImages,
    /**
     * Whether the button to associate the selected images 
     * with a product should be enabled or not
     */
    enableProductAssociationButton,
    /**
     * Whether there are selected images or not
     */
    hasSelectedImages,
    /**
     * Shows the modal to upload new images
     */
    showModal,
    /**
     * Toggles the modal to upload new images
     */
    columnDisplay,
    /**
     * Selects or deselects an image
     */
    select,
    /**
     * Toggles the modal to upload new images
     */
    toggle,
    /**
     * Uploads the selected files
     */
    upload
  }
}
