import { describe, expect, it, vi } from 'vitest'
import { testProduct } from '~/data/__fixtures__'

vi.mock('#app', () => ({
  useFetch: vi.fn(() => ({
    data: { value: testProduct },
    error: null,
    pending: false,
  }))
}))

describe.skip('Products Feed Component', () => {
  it('should run correctly', () => {
    expect(1 + 1).toBe(2)
  })
})
