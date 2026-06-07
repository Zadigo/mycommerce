import { describe, it, vi } from 'vitest'

vi.mock('../../app/composables/use/useForTesting', () => {
  return {
    useForTesting: vi.fn(() => {
      return {
        data: [{ id: 1, title: 'Test Todo' }]
      }
    })
  }
})

vi.mock('@vueuse/core', async (importActual) => {
  const actual = await importActual<typeof import('@vueuse/core')>()
  return {
    ...actual,
    useThrottleFn: vi.fn((fn: Function) => fn).mockReturnValue(() => 'mocked test'),
    provideLocal: vi.fn()
  }
})

describe('useEditCartItemComposable', () => {
  it('should mock useForTesting composable', async () => {
    const { useForTesting } = await import('../../app/composables/index')
    await useForTesting()
  })
})
