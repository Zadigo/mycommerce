import type { ProductImage } from "~/types"

export function useImages () {
    const { vueApp } = useNuxtApp()
    
    const showModal = ref(false)
    const selectedImage = ref<ProductImage | null | undefined>()

    function selectImage (image: ProductImage, fn: () => void) {
        showModal.value = true
        selectedImage.value = image
        fn.call(vueApp)
    }

    function handleSelectedImage (image: ProductImage) {
        selectedImage.value = image
        showModal.value = true
    }

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
