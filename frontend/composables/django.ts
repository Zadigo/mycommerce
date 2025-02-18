export function useDjangoUtilies() {
    const paginationUrl = ref<URL>()

    function getBaseUrl(port = 8000) {
        let loc = 'http'
        let domain = `127.0.0.1:${port}`
        
        if (inProduction()) {
            loc = 'https'
            domain = useRuntimeConfig().public.djangoProdUrl || ''
        }
        
        const bits = [loc, domain]
        const url = bits.join('')

        return new URL(url).toString()
    }

    function mediaPath(path: string | null | undefined, altImage?: string | undefined): string | undefined {
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

    function builLimitOffset(url: string | null | undefined, limit = 100, offset = 100) {
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
