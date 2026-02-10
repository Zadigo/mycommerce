import type { Undefineable } from "~/types"

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
 * 
 * @param base The base of the id, usually the component name
 * @param parts The parts to be added to the id, usually the props of the component
 */
export function createElementId(base: string, part: Undefineable<string | number>, join = '__') {
  const _part = (part || '').toString().replace(' ', '-')
  return `${base}${join}${_part}`
}
