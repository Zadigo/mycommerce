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
    useCookie: vi.fn().mockReturnValue({
      value: 'mocked-cookie',
      set: vi.fn(),
      remove: vi.fn()
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
