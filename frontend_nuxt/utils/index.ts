import type { App } from 'vue'

export * from './footer'
export * from './company'

interface DebounceOptions {
    leading?: boolean
    trailing?: boolean
}

type ReturnValues = string[] | number[] | Record<string, string | number | null | undefined>[]

interface FunctionSignature {
    <T>(args: T): T
}

interface FunctionReturn<T> {
    cancel(): void
    flush(): T | undefined
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

// T extends (...args: ReturnValues) => ReturnValues -> FunctionSignature
// T & { cancel(): void, flush(): ReturnType<T> | undefined } -> FunctionReturn
export function debounce<T extends (...args: ReturnValues) => ReturnValues>(func: T, wait: number, options?: DebounceOptions): T & { cancel(): void, flush(): ReturnType<T> | undefined } {
    let timeout: ReturnType<typeof setTimeout> | null
    let result: ReturnType<T> | undefined
    let lastCallTime: number | null = null
    let lastInvokeTime = 0

    const leading = options?.leading || false
    const trailing = options?.trailing !== false

    // const { vueApp } = useNuxtApp()

    function invokeFunc (time: number): ReturnType<T> {
        lastInvokeTime = time
        return func.apply(this as any) as ReturnType<T>
    }

    function shouldInvoke (time: number): boolean {
        const timeSinceLastCall = time - lastCallTime
        const timeSinceLastInvoke = time - lastInvokeTime

        // Call if:
        // 1. Never been called before
        // 2. Time since last call exceeds wait period
        // 3. Leading edge is enabled and enough time has passed
        return (
            lastCallTime === null ||
            (timeSinceLastCall >= wait) ||
            (leading && timeSinceLastInvoke >= wait)
        )
    }

    function debounced (this: any, ...args: Parameters<T>): ReturnType<T> | undefined {
        const time = Date.now()
        const isInvoking = shouldInvoke(time)

        lastCallTime = time

        if (timeout) {
            clearTimeout(timeout)
        }

        if (isInvoking) {
            if (leading && lastInvokeTime !== 0) {
                result = invokeFunc(time)
            }
        }
        
        timeout = setTimeout(() => {
            if (trailing && !(leading && isInvoking)) {
                result = invokeFunc(Date.now())
            }

            timeout = null
        }, wait)

        return result
    }

    debounced.cancel = function () {
        if (timeout) {
            clearTimeout(timeout)
            timeout = null
        }

        // Reset tracking variables
        lastCallTime = null;
        lastInvokeTime = 0;
    }

    // Provide method to immediately invoke the function
    debounced.flush = function () {
        if (timeout) {
            clearTimeout(timeout)
            return invokeFunction(Date.now())
        }
        return result
    }

    return debounced
}
