import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('@vueuse/core', async (importActual) => {
  const actual = await importActual<typeof import('@vueuse/core')>()
  return {
    ...actual,
    useThrottleFn: vi.fn((fn: Function) => fn).mockReturnValue(() => 'mocked test'),
    provideLocal: vi.fn()
  }
})

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  updateDoc: vi.fn()
}))

describe('useEditCartItemComposable', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with the default values', async () => {
    const result = useEditCartItemComposable()

    expect(result.editedCartItem.value).toBeUndefined()
    expect(result.addQuantity).toBeInstanceOf(Function)
    expect(result.decreaseQuantity).toBeInstanceOf(Function)
  })
})
