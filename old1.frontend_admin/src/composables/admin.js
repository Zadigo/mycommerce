import { getCurrentInstance, ref } from 'vue'
import { api } from 'src/boot/axios'

export function useUtilities () {
  /**
   * Builds the full url path to the
   * django /media/ backend folder for
   * images that require this construction 
   */
  function djangoMediaPath (path, mediaPrefix = false) {
    console.log(path)
    let url

    if (path === null || typeof path === 'undefined') {
      const image = new URL(`./assets/placeholder.svg`, import.meta.url)
      return image.toString()
    }

    if (import.meta.env.DEV) {
      url = process.env.DEVELOPMENT_URL
    } else {
      url = process.env.PRODUCTION_URL
    }

    if (mediaPrefix) {
      url += '/media/'
    }

    const finalUrl = new URL(path, url)
    return finalUrl.toString()
  }

  function localImagePath (path) {
    const image = new URL(`./assets/${path}`, import.meta.url)
    return image.toString()
  }

  function conditionalImagePath (path, fallback = 'placeholder.svg') {
    const result = djangoMediaPath(path)
    if (!result) {
      return localImagePath(fallback)
    } else {
      return result
    }
  }

  return {
    djangoMediaPath,
    localImagePath,
    conditionalImagePath
  }
}

export function useImagesUpload () {
  const app = getCurrentInstance()
  const images = ref({})
  const selectedFiles = ref([])
  const selectedFilesBaseName = ref(null)

  function createFormData () {
    const formData = new FormData()

    selectedFiles.value.forEach((file, i) => {
      formData.append('files', file, file.name)
      formData.append('name', `${selectedFilesBaseName.value} ${i}`)
    })
    return  formData
  }

  /**
   * Upload images without associating them to
   * any product in the database 
   */
  async function handleUploadImages() {
    try {
      // const formData = new FormData()

      // selectedFiles.value.forEach((file, i) => {
      //   formData.append('files', file, file.name)
      //   formData.append('name', `${selectedFilesBaseName.value} ${i}`)
      // })
      const formData = createFormData()

      const response = await api.post('shop/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      images.value = response.data
      selectedFiles.value = []
      selectedFilesBaseName.value = null
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * Upload images to a specific given product
   */
  async function uploadImagesToProduct (product, callback) {
    try {
      const formData = createFormData()

      const response = await api.post(`shop/products/${product.id}/upload-images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      // images.value = response.data
      selectedFiles.value = []
      selectedFilesBaseName.value = null

      if (typeof callback === 'function') {
        callback.call(app, response.data)
      }
    } catch (e) {
      console.log(e)
    }
  }
  
  return {
    images,
    selectedFiles,
    selectedFilesBaseName,
    uploadImagesToProduct,
    handleUploadImages
  }
}
