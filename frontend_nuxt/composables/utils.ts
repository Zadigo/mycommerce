import type { AxiosError } from "axios"
import { ref, isRef } from 'vue'

type ArrayAnyValues = (string | number)[]
type RefArrayAnyValues = ArrayAnyValues | Ref<(string | number)[]>


export function useUtilities () {
    function isNull<T>(item: T): boolean {
        return (
            item === null ||
            typeof item  === 'undefined' ||
            item === '' ||
            item === ' '
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

    function debounce<F extends (...args[]: any[]) => void>(fn: F, delay: number): (...args: Parameters<F>) => void {
        let timer: ReturnType<typeof setTimeout>

        return function (...args: Parameters<F>) {
            clearTimeout(timer)
            timer = setTimeout(() => fn(...args), delay)
        };
    }

    return {
        isNull,
        debounce,
        hasNull,
        readFile,
        readFiles
    }
}

export function useListManager () {
    const managedList = ref<RefArrayAnyValues>([])
    const history = ref<ArrayAnyValues>([])
    const deletions = ref<ArrayAnyValues>([])

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
        managedList,
        history,
        save
    }
}

export function useAxiosUtilities () {
    const router = useRouter()

    function handleError (e: AxiosError) {
        if (e.response?.status === 404) {
            router.push('/404')
        }
    }

    return {
        handleError
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

    function mediaPath (path: string | null | undefined): string | null {
        const baseUrl = getBaseUrl()

        if (path) {
            const fullPath = path.startsWith('/') ? `/media${path}` : `/media/${path}`
            return new URL(fullPath, baseUrl).toString()
        } else {
            return null
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

        return new URLSearchParams({ 
            limit: defaultLimit.toString(), 
            offset: defaultOffset.toString() 
        }).toString()
    }

    return {
        mediaPath,
        getBaseUrl,
        builLimitOffset
    }
}
