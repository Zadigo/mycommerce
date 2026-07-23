export type ParentId = 'link' | 'cta' | 'image' | 'product'

export type LocationId = 'header' | 'footer' | 'sidebar' | 'content' | 'modal' | 'navbar'

/**
 * Creates a unique element ID by combining a base string with additional parts.
 * @param base The base of the id, usually the component name.
 * @param location The location of the element, usually the section of the page.
 * @param parts The parts to be added to the id, usually the props of the component.
 */
export function createElementId(base: ParentId, location: LocationId, ...parts: Array<string | number | undefined | null>): string {
  const _parts = parts.filter(p => p !== undefined && p !== null).map(p => (p || '').toString().replace(/ /g, '-')).join('__')
  return `${base}-${location}-${_parts}`
}
