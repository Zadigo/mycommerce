import { vi } from 'vitest'

// Minimal mock for firebase/firestore
export function getFirestore(app?: any) {
  return {
    settings: (_: any) => { },
    collection: (path: string) => ({
      path,
      doc: (id: string) => ({
        id,
        set: vi.fn(() => Promise.resolve()),
        get: vi.fn(() => Promise.resolve({
          exists: true,
          data: () => ({}),
        })),
        update: vi.fn(() => Promise.resolve()),
        delete: vi.fn(() => Promise.resolve()),
        collection: (sub: string) => ({
          path: `${path}/${id}/${sub}`,
          // same doc behavior...
        }),
      }),
      add: vi.fn(() => Promise.resolve({ id: 'mocked-id' })),
      where: (_: any, __: any, ___: any) => ({
        get: vi.fn(() => Promise.resolve({ docs: [] })),
      }),
      get: vi.fn(() => Promise.resolve({ docs: [] })),
    }),
    doc: (db: any, path: string) => ({
      path,
      id: path.split('/').pop(),
      set: vi.fn(() => Promise.resolve()),
      get: vi.fn(() => Promise.resolve({ exists: true, data: () => ({}) })),
    }),
    query: (_: any, ..._args: any[]) => ({
      get: vi.fn(() => Promise.resolve({ docs: [] })),
    }),
    onSnapshot: (_: any, cb: any) => {
      cb({ docs: [] })
      return () => { }
    },
    // add more firestore functions if you use them
  }
}
