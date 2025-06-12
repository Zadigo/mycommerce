import type { ProductImage } from '~/types'

export function useImages () {
    const { vueApp } = useNuxtApp()
    
    const showModal = ref(false)
    const selectedImage = ref<ProductImage | null | undefined>()
    
    /**
     * Selects and image and opens the images modal
     * @param image The image to select
     * @param fn Callback function to be used
     */
    function selectImage (image: ProductImage, fn: () => void) {
        showModal.value = true
        selectedImage.value = image
        fn.call(vueApp)
    }

    /**
     * Selects an image within a group of images
     * @param image The selected image
     */
    function handleSelectedImage (image: ProductImage) {
        selectedImage.value = image
        showModal.value = true
    }

    /**
     * Closes the image modal
     */
    function handleCloseSelection () {
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
