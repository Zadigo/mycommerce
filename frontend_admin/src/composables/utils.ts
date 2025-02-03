import axios, { AxiosError, AxiosInstance } from 'axios'
import { api } from 'src/boot/axios'
import { Product, ProductImage } from 'src/types'
import { getCurrentInstance, ref } from 'vue'

export function useDjangoUtilies () {
  const secure = ref(false)
  const port = ref(8000)
  const paginationUrl = ref<URL>()

  function getBaseUrl () {
    let domain = `127.0.0.1:${port.value}`

    if (process.env.DEV === 'production') {
      domain = process.env.NUXT_DJANGO_PROD_URL || ''
    }

    const loc = secure.value ? 'https://' : 'http://'
    const bits = [loc, domain]
    const url = bits.join('')

    return new URL(url).toString()
  }

  function mediaPath (path: string | null | undefined, altImage?: string | undefined): string | undefined {
    const baseUrl = getBaseUrl()

    if (path) {
      if (path.startsWith('http')) {
        return path
      }

      const fullPath = path.startsWith('/media') ? `${path}` : `/media/${path}`
      return new URL(fullPath, baseUrl).toString()
    } else {
      return altImage
    }
  }

  function builLimitOffset (url: string | null | undefined, limit = 100, offset = 100) {
    let defaultLimit: string | number = 100
    let defaultOffset: string | number = 0

    if (url) {
      paginationUrl.value = new URL(url)

      const potentialLimit = paginationUrl.value.searchParams.get('limit')
      const potentialOffset = paginationUrl.value.searchParams.get('offset')

      defaultLimit = potentialLimit || limit
      defaultOffset = potentialOffset || offset
    }

    const query = new URLSearchParams({ limit: defaultLimit.toString(), offset: defaultOffset.toString() }).toString()

    return {
      query,
      limit: defaultLimit,
      offset: defaultOffset
    }
  }

  return {
    mediaPath,
    getBaseUrl,
    builLimitOffset
  }
}

export function useImagesUpload () {
  const app = getCurrentInstance()

  const images = ref<ProductImage[]>([])
  const selectedFiles = ref<File[]>([])
  const selectedFilesBaseName = ref<string>('')
  const isRunning = ref(false)

  function createFormData () {
    const formData = new FormData()

    selectedFiles.value.forEach((file, i) => {
      formData.append('files', file, file.name)
      formData.append('file_names', `${selectedFilesBaseName.value} ${i}`)
    })
    return formData
  }

  /**
   * Upload images without associating them to
   * any product in the database
   */
  async function handleUploadImages (callback: (data: ProductImage[]) => void) {
    try {
      isRunning.value = true

      const formData = createFormData()
      const response = await api.post<ProductImage[]>('admin/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      images.value = response.data
      selectedFiles.value = []
      selectedFilesBaseName.value = ''
      isRunning.value = false

      if (typeof callback === 'function') {
        callback.call(app, response.data)
      }
    } catch (e) {
      if (e instanceof AxiosError && e.response) {
        // Handle
      }
    }
  }

  /**
   * Upload images to a specific given product
   */
  async function uploadImagesToProduct (product: Product | null | undefined, callback: (data: ProductImage[]) => void) {
    try {
      if (product) {
        isRunning.value = true

        const formData = createFormData()
        const response = await api.post<ProductImage[]>(`admin/products/${product.id}/upload-images`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        selectedFiles.value = []
        selectedFilesBaseName.value = ''
        isRunning.value = false

        if (typeof callback === 'function') {
          callback.call(app, response.data)
        }
      }
    } catch (e) {
      if (e instanceof AxiosError && e.response) {
        // Handle
      }
    }
  }

  return {
    images,
    isRunning,
    selectedFiles,
    selectedFilesBaseName,
    uploadImagesToProduct,
    handleUploadImages
  }
}

export function useAxiosClient () {
  /**
   * Helper function for creating variations of the baseURL
   */
  function getBaseUrl(path = '/api/v1/', alternativeDomain?: string | null, port = '8000', secure = false) {
    let domain = alternativeDomain || `127.0.0.1:${port}`

    if (process.env.DEV === 'production') {
      domain = alternativeDomain || process.env.NUXT_DJANGO_PROD_URL || ''
    }

    const loc = secure || process.env.DEV === 'production' ? 'https://' : 'http://'
    const bits = [loc, domain]
    const url = bits.join('')

    return new URL(path, url).toString()
  }

  function createClient(path = '/api/v1/', alternativeDomain?: string | null, port = '8000'): AxiosInstance {
    const client: AxiosInstance = axios.create({
      baseURL: getBaseUrl(path, alternativeDomain, port),
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
      timeout: 10000
    })

    return client
  }

  return {
    getBaseUrl,
    createClient
  }
}

export function useDebounce () {
  function debounce<T extends (...args: any[]) => void>(func: T, wait: number, immediate: boolean = false) {
    let timeout: ReturnType<typeof setTimeout> | null = null

    // return function (this: any, ...callbackArgs: Parameters<T>) {
    return function (...callbackArgs: Parameters<T>) {
      // const context = this

      function later () {
        timeout = null

        if (!immediate) {
          // func.apply(context, callbackArgs)
          func.apply(callbackArgs)
        }
      }

      const callNow = immediate && !timeout

      if (timeout) {
        clearTimeout(timeout)
      }
      timeout = setTimeout(later, wait)

      if (callNow) {
        // func.apply(context, callbackArgs)
        func.apply(callbackArgs)
      }
    }
  }

  return {
    debounce
  }
}
