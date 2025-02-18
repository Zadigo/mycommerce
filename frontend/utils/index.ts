export function inProduction() {
    return process.env.NODE_ENV !== 'development'
}

export function isNull<T>(item: T): boolean {
    let trueValue

    if (isRef(item)) {
        trueValue = item.value
    } else {
        trueValue = item
    }

    return (
        trueValue === null ||
        typeof trueValue === 'undefined' ||
        trueValue === '' ||
        trueValue === ' '
    )
}

export function useDebounce() {
    function debounce<T extends (...args: any[]) => void>(func: T, wait: number, immediate: boolean = false) {
        let timeout: ReturnType<typeof setTimeout> | null = null

        // return function (this: any, ...callbackArgs: Parameters<T>) {
        return function (...callbackArgs: Parameters<T>) {
            // const context = this

            function later() {
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
