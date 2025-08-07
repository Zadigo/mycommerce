export * from './client'

/**
 * Function used to check if the application is in a
 * production environment 
 */
export function inProduction() {
  return process.env.NODE_ENV !== 'development'
}

/**
 * Function used to scroll to the top of the page 
 */
export function scrollToTop() {
  window.scroll({ top: 0, behavior: 'smooth' })
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
  /**
   * TODO: Documentation
   * 
   * @param func Function to debounce
   * @param [immediate=false] Whether the function should be executed immediately
   * @param wait The amount of time to wait before execting the function
   */
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

/**
 * Helper function to introduce a delay 
 * 
 * @param ms The delay in milleseconds
 */
export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
