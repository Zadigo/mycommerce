import { vi } from 'vitest'

// const { mockNuxtClient, mockUseNuxtApp } = vi.hoisted(() => {
//   const mockNuxtClient = vi.fn()
//   const mockUseNuxtApp = vi.fn(() => ({
//     $client: mockNuxtClient,
//     vueApp: {}
//   }))
//   return {
//     mockNuxtClient,
//     mockUseNuxtApp
//   }
// })

vi.mock('#app', async () => {
  const actual = await vi.importActual<typeof import('#app')>('#app')

  return {
    ...actual,
    useRouter: vi.fn(() => ({
      push: vi.fn()
    })),
    useCookie: vi.fn(),
    useI18n: () => ({
      t: (key: string) => key,
      locale: 'fr',
      setLocale: vi.fn()
    })
  }
})

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')

  return {
    ...actual,
    useSessionStorage: vi.fn(),
    useLocalStorage: vi.fn(),
    useIntersectionObserver: vi.fn(),
    useRefHistory: vi.fn().mockReturnValue({
      last: vi.fn(() => null),
      history: [],
      undo: vi.fn(),
      redo: vi.fn(),
      canUndo: false,
      canRedo: false
    })
  }
})

vi.stubGlobal('useNuxtApp', () => ({
  $client: vi.fn(),
  vueApp: {}
}))

// vi.mock('nuxt/app', () => {
//   return {
//     useNuxtApp: mockUseNuxtApp
//   }
// })

// vi.mock('#imports', () => {
//   return {
//     useNuxtApp: mockUseNuxtApp
//   }
// })

// vi.mock('vue-i18n', async () => {
//   const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')

//   return {
//     ...actual,
//     useI18n: () => ({
//       t: (key: string) => key,
//       locale: 'fr',
//       setLocale: vi.fn()
//     })
//   }
// })

// Make mockNuxtClient available globally
// global.mockNuxtClient = mockNuxtClient

vi.mock('#app/composables/head', async () => {
  const actual = await vi.importActual<typeof import('../.nuxt/imports')>('../.nuxt/imports')

  return {
    ...actual,
    useSeoMeta: vi.fn().mockReturnValue({
      title: 'Some Title'
    })
  }
})

vi.mock('~/composables/errors', async () => {
  const actual = await vi.importActual<typeof import('../app/composables/errors')>('../app/composables/errors')
  return {
    ...actual,
    useErrorHandler: vi.fn().mockReturnValue({
      customHandleError: vi.fn((e: unknown) => e)
    })
  }
})
