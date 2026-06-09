import { vi } from 'vitest'

// Simple mock for firebase/database
export function getDatabase(app?: any) {
  return {
    ref: (path: string) => ({
      path,
      set: vi.fn((value: any) => Promise.resolve()),
      push: vi.fn((value: any) =>
        Promise.resolve({
          key: 'mockedKey',
        })
      ),
      onValue: vi.fn((callback: (snapshot: any) => void) => {
        // Optionally invoke callback with empty mock
        callback({
          val: () => null,
        })
      }),
      off: vi.fn(),
    }),
    // Add other methods you use, e.g., serverTimestamp
    serverTimestamp: () => Date.now(),
  }
}

// Mock other helpers if needed
// export function ref(db: any, path: string) {
//   return db.ref(path)
// }
// export function push(refObj: any, value?: any) {
//   return refObj.push(value)
// }
// export function set(refObj: any, value: any) {
//   return refObj.set(value)
// }
// export function onValue(refObj: any, cb: any) {
//   return refObj.onValue(cb)
// }
