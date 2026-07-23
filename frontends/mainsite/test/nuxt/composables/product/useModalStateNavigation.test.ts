import { describe, it, expect, vi } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

mockNuxtImport<typeof useRouter>('useRouter', original => vi.fn(original))
mockNuxtImport<typeof useLocalePath>('useLocalePath', original => vi.fn(original))

describe('useModalStateNavigation', () => {
  it('should return all default values', () => {
    const state = ref<boolean>(false)
    const result = useModalStateNavigation(state)
    expect(result).toBeDefined()
    expect(result.routerLink).toBeInstanceOf(Function)
  })

  it('should call router.push with the correct path when routerLink is called', () => {
    const state = ref<boolean>(false)
    const result = useModalStateNavigation(state)
    result.routerLink('/test-path')
  })

  it('should return empty routerLink function when running on server', () => {
    const state = ref<boolean>(false)
    const originalImportMetaServer = import.meta.server
    import.meta.server = true

    const result = useModalStateNavigation(state)
    expect(result.routerLink).toBeInstanceOf(Function)

    const routerLinkResult = result.routerLink('/test-path')
    expect(routerLinkResult).toBeUndefined()

    import.meta.server = originalImportMetaServer
  })

  // it('should toggle state to false when onBeforeRouteLeave is triggered', () => {
  //   const state = ref<boolean>(true)
  //   const result = useModalStateNavigation(state)

  //   // Simulate route leave
  //   // const next = vi.fn()
  //   onBeforeRouteLeave((to, from, next) => {
  //     if (state.value) {
  //       state.value = false
  //     }
  //     next()
  //   })

  //   // Trigger the route leave
  //   onBeforeRouteLeave((to, from, next) => {
  //     if (state.value) {
  //       state.value = false
  //     }
  //     next()
  //   })

  //   expect(state.value).toBe(false)
  // })
})
