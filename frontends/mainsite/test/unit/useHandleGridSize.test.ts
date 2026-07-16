import { describe, vi, expect, it } from 'vitest'
import { useHandleGridSize } from '../../layers/base/app/composables/use/grid'
import { mountSuspended } from '@nuxt/test-utils/runtime'

vi.mock('@vueuse/core', async (importActual) => {
  const actual = await importActual<typeof import('@vueuse/core')>()
  return {
    ...actual,
    useLocalStorage: (_key: string, initialValue: number) => {
      return ref(initialValue)
    }
  }
})

describe.only('Test for useHandleGridSize', () => {
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

  it('should return the correct grid class', async () => {
    vi.stubGlobal('import', { meta: { server: false } })

    let result: ReturnType<typeof useHandleGridSize>

    const component = await mountSuspended(defineComponent({
      template: `
        <div :class="gridClass">
          Grid class
        </div>
      `,
      setup() {
        result = useHandleGridSize()
        result.handleGridSize(3)
        return { gridClass: result.gridClass}
      }
    }))

    const divEl = component.find('div')
    expect(divEl.classes()).toContain('grid-cols-1')
    expect(divEl.classes()).toContain('md:grid-cols-1')
    expect(divEl.classes()).toContain('lg:grid-cols-3')
  })

  const testCases: { gridSize: number, expectedThreeState: string, expectedFourState: string }[] = [
    {
      gridSize: 3,
      expectedThreeState: 'light',
      expectedFourState: 'ghost'
    },
    {
      gridSize: 4,
      expectedThreeState: 'ghost',
      expectedFourState: 'light'
    }
  ]

  testCases.forEach(({ gridSize, expectedThreeState, expectedFourState }) => {
    it(`should return correct states for grid size ${gridSize}`, async () => {
      vi.stubGlobal('import', { meta: { server: false } })

      const { threeState, fourState, handleGridSize } = useHandleGridSize()
      handleGridSize(gridSize)

      expect(threeState.value).toBe(expectedThreeState)
      expect(fourState.value).toBe(expectedFourState)
    })
  })
})
