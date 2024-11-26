import type { AxiosInstance } from "axios"
import { isRef, ref } from 'vue'

import axios from 'axios'


type ArrayAnyValues = (string | number)[]
type RefArrayAnyValues = ArrayAnyValues | Ref<(string | number)[]>
type RefObjectAnyValues = Ref<Record<string, (string | number)[] | string | number>>

export function useUtilities () {
    function scrollToTop () {
        window.scroll({ top: 0, behavior: 'smooth' })
    }

    // TODO: Remove. Use as simple function
    function isNull<T>(item: T): boolean {
        let trueValue

        if (isRef(item)) {
            trueValue = item.value
        } else {
            trueValue = item
        }

        return (
            trueValue === null ||
            typeof trueValue  === 'undefined' ||
            trueValue === '' ||
            trueValue === ' '
        )
    }

    function hasNull<T extends ArrayAnyValues>(items: T): boolean {
        return items.some(v => {
            return v === null || v === '' || typeof v === 'undefined'
        })
    }

    function readFile (e: Event): string | undefined {
        let preview
        const input = e.target as HTMLInputElement

        if (input.files) {
            const file = input.files[0]
            const reader = new FileReader

            reader.onload = e => {
                preview = e.target?.result
            }

            reader.readAsDataURL(file)
        }

        return preview
    }

    function readFiles (e: Event): (string | ArrayBuffer | null | undefined)[] {
        const input = e.target as HTMLInputElement
        
        if (input.files) {
            let preview: string | ArrayBuffer | undefined | null
            const reader = new FileReader

            reader.onload = e => {
                preview = e.target?.result
            }

            return Object.values(input.files).map(f => {
                if (f) {
                    reader.readAsDataURL(f)
                }
                return preview
            }) 
        }
        
        return []
    }

    // function debounce<F extends (...args[]: any[]) => void>(fn: F, delay: number): (...args: Parameters<F>) => void {
    //     let timer: ReturnType<typeof setTimeout>

    //     return function (...args: Parameters<F>) {
    //         clearTimeout(timer)
    //         timer = setTimeout(() => fn(...args), delay)
    //     };
    // }

    return {
        isNull,
        scrollToTop,
        // debounce,
        hasNull,
        readFile,
        readFiles
    }
}

export function useListManager () {
    const managedObject = ref<Record<string, (string | number)[] | string | number | null>>()
    const managedList = ref<RefArrayAnyValues>([])
    const history = ref<ArrayAnyValues>([])
    const deletions = ref<ArrayAnyValues>([])

    function updateList<T extends RefArrayAnyValues>(items: T, value: string | number) {
        if (Array.isArray(items)) {
            if (items.includes(value)) {
                const index = items.indexOf(value)
                items.splice(index, 1)
            } else {
                items.push(value)
            }
        } else {
            if (items.value.includes(value)) {
                const index = items.value.indexOf(value)
                items.value.splice(index, 1)
            } else {
                items.value.push(value)
            }
        }
    }

    function update(key: string, value: string | number): boolean {
        if (managedObject.value) {
            if (Array.isArray(managedObject.value[key])) {
                if (managedObject.value[key].includes(value)) {
                    const index = managedObject.value[key].indexOf(value)
                    managedObject.value[key].splice(index, 1)
                } else {
                    managedObject.value[key].push(value)
                }
                return true
            }
        }
        return false
    }

    function save<T extends RefArrayAnyValues>(items: T, item: string | number) {
        if (managedList.value.length === 0) {
            if (isRef(items)) {
                managedList.value = [...items.value]
            } else {
                managedList.value = [...items]
            }
        }

        if (managedList.value.includes(item)) {
            const index = managedList.value.indexOf(item)
            const result = managedList.value.splice(index, 1)
            deletions.value = [...result]
        } else {
            managedList.value.push(item)
            history.value.push(item)
        }
    }

    return {
        deletions,
        managedObject,
        managedList,
        history,
        updateList,
        update,
        save
    }
}

export function useDjangoUtilies () {
    const secure = ref(false)
    const port = ref(8000)
    const paginationUrl = ref<URL>()

    function getBaseUrl() {
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

/**
 * An interface that abstracts Axios in order
 * to send requests to the different endpoints
 * of the Django backend 
 */
export function useAxiosClient () {
    // const router = useRouter()

    // TODO: Must be used in a component because
    // of inject()
    // function handleError(e: AxiosError) {
    //     if (e.response?.status === 404) {
    //         router.push('/404')
    //     }
    // }

    /**
     * A helper function that creates and retuns 
     * the base url to use for Axios
     */
    function getBaseUrl(path = '/api/v1/', secure = false, port = '8000') {
        let domain = `127.0.0.1:${port}`

        if (process.env.DEV === 'production') {
            domain = process.env.NUXT_DJANGO_PROD_URL || ''
        }

        const loc = secure || process.env.DEV === 'production' ? 'https://' : 'http://'
        const bits = [loc, domain]
        const url = bits.join('')

        return new URL(path, url).toString()
    }

    function createClient(path = '/api/v1/'): AxiosInstance {
        const client: AxiosInstance = axios.create({
            baseURL: getBaseUrl(path),
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
            timeout: 10000
        })

        return client
    }

    return {
        getBaseUrl,
        // handleError,
        createClient
    }
}
