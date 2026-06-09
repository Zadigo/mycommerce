import type { ProductImage } from '~/types'

export interface FileElement {
  name: string,
  content: File | Blob | null
}

export interface RequestData {
  files: FileElement[]
}

export interface ImageFilters {
  column: string
  operator: 'Equals' | 'Not equal'
  value: string
}

/**
 * Composable used to manage images
 */
export async function useImagesComposable() {
  const data = await $fetch<ProductImage[]>('/admin/v1/images', {
    method: 'GET',
    baseURL: useRuntimeConfig().public.prodDomain
  })

  const images = ref<ProductImage[]>(data)

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

  const selectedImages = ref<ProductImage[]>([])
  const numberOfSelectedImages = computed(() => selectedImages.value.length)

  function select(state: boolean, image: ProductImage) {
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
    enableProductAssociationButton,
    hasSelectedImages,
    /**
     * Shows the modal to upload new images
     */
    showModal,
    columnDisplay,
    images,
    select,
    toggle,
    upload
  }
}

/**
 * Composable used to associate images with products
 * @param currentImages - The images to associate with the product
 */
export function useImageAssociation(currentImages: Ref<ProductImage[]>) {
  const images = toRef(currentImages)
  const selectedImages = ref<ProductImage[]>([])

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
  async function unlink(image: ProductImage) {
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
