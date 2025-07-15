// import { afterAll, afterEach, beforeAll } from 'vitest'
// import { setupServer } from 'msw/node'
// import { http, HttpResponse } from 'msw'

import { vi } from 'vitest'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')

  return {
    ...actual,
    useI18n: () => ({
      t: (key: string) => key,
      locale: 'fr',
      setLocale: vi.fn()
    })
  }
})

vi.mock('#app', async () => {
  const actual = await vi.importActual<typeof import('#app')>('#app')

  return {
    ...actual,
    useRouter: vi.fn(() => ({ push: vi.fn() })),
    useCookie: vi.fn()
  }
})

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')

  return {
    ...actual,
    useSessionStorage: vi.fn(),
    useLocalStorage: vi.fn(),
    useIntersectionObserver: vi.fn()
  }
})

vi.mock('#app/composables/head', async () => {
  const actual = await vi.importActual<typeof import('#app/composables/head')>('#app/composables/head')
  
  return {
    ...actual,
    useSeoMeta: vi.fn().mockReturnValue({
      title: 'Some Title'
    })
  }
})

vi.mock('~/composables/errors', async () => {
  const actual = await vi.importActual<typeof import('~/composables/errors')>('~/composables/errors')
  return {
    ...actual,
    useErrorHandler: vi.fn().mockReturnValue({
      customHandleError: vi.fn((e: unknown) => e)
    })
  }
})

// const posts = [
//   {
//     userId: 1,
//     id: 1,
//     title: 'first post title',
//     body: 'first post body',
//   }
// ]

// export const restHandlers = [
//   http.get('https://rest-endpoint.example/path/to/posts', () => {
//     return HttpResponse.json(posts)
//   }),
// ]

// const server = setupServer(...restHandlers)

// // Start server before all tests
// beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

// // Close server after all tests
// afterAll(() => server.close())

// // Reset handlers after each test for test isolation
// afterEach(() => server.resetHandlers())
