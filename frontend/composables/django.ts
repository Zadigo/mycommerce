export function useDjangoUtilies() {
    function mediaPath(path: string | null | undefined, altImage?: string | undefined): string | undefined {
        if (path) {
            if (path.startsWith('http')) {
                return path
            }

            const fullPath = path.startsWith('/media') ? `${path}` : `/media/${path}`
            return new URL(fullPath, useRuntimeConfig().public.prodDomain).toString()
        } else {
            return altImage
        }
    }

    return {
        mediaPath
    }
}
