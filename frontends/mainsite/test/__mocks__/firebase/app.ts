import { vi } from 'vitest'

// Minimal mock for firebase/app
export function initializeApp(config?: any) {
  // Return a fake Firebase app instance
  return {
    name: '[DEFAULT]',
    options: config || {},
    // Add any other properties you reference in your code
  }
}

// Mock getAuth if used
export function getAuth(app?: any) {
  return {
    currentUser: null,
    signInWithEmailAndPassword: vi.fn(),
    signOut: vi.fn()
  }
}

// Other firebase/app exports
export const apps: any[] = []
export const SDK_VERSION = '0.0.0-mock'
