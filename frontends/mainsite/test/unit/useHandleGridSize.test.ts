import { describe, vi, expect, it } from 'vitest'
import { useHandleGridSize } from '../../layers/base/app/composables/use/grid'

vi.mock('@vueuse/core', async (importActual) => {
  const actual = await importActual<typeof import('@vueuse/core')>();
  return {
    ...actual,
    useLocalStorage: (_key: string, initialValue: number) => {
      return ref(initialValue)
    }
  }
})

// describe('useHandleGridSize', () => {
//   it('should initialize with default values on server', async () => {
//     // Simulate server environment
//     vi.stubGlobal('import', { meta: { server: true } })

//     const { useHandleGridSize } = await import('../../app/composables/use/grid')
//     const {
//       threeState,
//       fourState,
//       gridClass,
//       currentGridSize,
//       handleGridSize
//     } = useHandleGridSize()
    
//     expect(threeState.value).toBe('ghost')
//     expect(fourState.value).toBe('ghost')
//     expect(gridClass.value).toBe('grid grid-cols-4 gap-2 px-1')
//     expect(currentGridSize.value).toBe(3)
//     expect(typeof handleGridSize).toBe('function')
//   })
// })


describe('Test for useHandleGridSize', () => {
  it('should initialize with default values on client', async () => {
    // Simulate client environment
    vi.stubGlobal('import', { meta: { server: false } })

    const { currentGridSize, handleGridSize } = useHandleGridSize()
    expect(currentGridSize.value).toBe(4)
    expect(typeof handleGridSize).toBe('function')
  })

  it('should handle grid size changes', async () => {
    // Simulate client environment
    vi.stubGlobal('import', { meta: { server: false } })

    const { currentGridSize, handleGridSize } = useHandleGridSize()
    handleGridSize(3)
    expect(currentGridSize.value).toBe(3)

    const callbackValue  = 4
    const callback = vi.fn(() => {
      expect(currentGridSize.value).toBe(callbackValue)
    })
    handleGridSize(4, callback)
  })
})
