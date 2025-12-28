import { describe, vi, expect, it } from 'vitest'

vi.mock('@vueuse/core', async (importActual) => {
  const actual = await importActual<typeof import('@vueuse/core')>();
  return {
    ...actual,
    useLocalStorage: (_key: string, initialValue: number) => {
      return ref(initialValue)
    }
  }
})

describe('useHandleGridSize', () => {
  it('should initialize with default values on server', async () => {
    // Simulate server environment
    vi.stubGlobal('import', { meta: { server: true } })

    const { useHandleGridSize } = await import('../../app/composables/use/grid')
    const {
      threeState,
      fourState,
      gridClass,
      currentGridSize,
      handleGridSize
    } = useHandleGridSize()
    
    expect(threeState.value).toBe('ghost')
    expect(fourState.value).toBe('ghost')
    expect(gridClass.value).toBe('grid grid-cols-4 gap-2 px-1')
    expect(currentGridSize.value).toBe(3)
    expect(typeof handleGridSize).toBe('function')
  })
})
