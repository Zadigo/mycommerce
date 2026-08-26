export function mediaUrl(path: string) {
  const _path = path.startsWith('/') ? path : `/${path}`
  return `${useRuntimeConfig().public.prodDomain}${_path}`
}
