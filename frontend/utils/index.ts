export interface JWTData {
  exp: number
  iat: number
  iss: string
  typ: string
  aud: string
  sub: string
  user_id: number
  cart_id: string
}

export function inProduction() {
  return process.env.NODE_ENV !== 'development'
}

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
 * 
 */
// export function parseJwt<T extends JWTData | null>(token: string | undefined | null): T {
//   console.log('parseJWT', token)
//   if (token && typeof token !== 'undefined') {
//     const base64Payload = token.split('.')[1]
//     const payload = Buffer.from(base64Payload, 'base64')

//     return JSON.parse(payload.toString())
//   } else {
//     return null
//   }
// }
