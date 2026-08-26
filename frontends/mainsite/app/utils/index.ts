export * from './errors'
export * from './ids'

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

/**
 * Function used to check if an object can be saved
 * @param obj The object to be checked
 */
export function objectCanBeSaved(obj: MaybeRef<Record<string, unknown>>): boolean {
  return Object.entries(toValue(obj)).map(([_, value]) => value !== '').every((val) => val === true)
}
