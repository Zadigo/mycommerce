import { describe, vi, expect, it, afterEach, beforeEach } from 'vitest'
import { useSizeSelection } from '../../layers/base/app/composables/use/size'
import { productFixture } from '../../layers/base/app/utils/__fixtures__/products'
import { mountSuspended } from '@nuxt/test-utils/runtime'

describe('useSizeSelection', () => {
  beforeEach(() => {
    vi.stubGlobal('NODE_ENV', 'test')
  })

  afterEach(() => {
    vi.resetAllMocks()
  })
  
  it('should initialize with default values', () => {
    vi.stubGlobal('import', { meta: { server: true } })

    const { hasSelection, availableSizes } = useSizeSelection(productFixture)

    expect(hasSelection).toBeDefined()
    expect(toValue(hasSelection)).toBe(false)
    expect(isRef(availableSizes)).toBe(true)
  })

  it('should be able to select size from existing sizes', async () => {
    vi.stubGlobal('import', { meta: { server: false, client: true } })

    const { hasSelection, selectedSize, selectSize } = useSizeSelection(productFixture)
    
    const size = productFixture.node.sizeSet[0]
    if (isDefined(size)) {
      void selectSize(size)
      expect(toValue(hasSelection)).toBe(true)
      expect(toValue(selectedSize)?.name).toBe('XS')
      expect(toValue(selectedSize)?.active).toBeTruthy()
    }
  })

  it.todo('should not select size if it is unavailable', async () => {
    vi.stubGlobal('import', { meta: { server: false, client: true } })
    
    const { hasSelection, selectedSize, selectSize } = useSizeSelection(productFixture)
    const unavailableSize = productFixture.node.sizeSet.find(size => !size.availability)

    expect(unavailableSize).toBeDefined()

    void selectSize(unavailableSize)

    expect(toValue(hasSelection)).toBe(false)
    expect(toValue(selectedSize)).toBeUndefined()
  })

  it('should reset the selected size', async () => {
    vi.stubGlobal('import', { meta: { server: false, client: true } })

    const { hasSelection, selectedSize, selectSize, reset } = useSizeSelection(productFixture)
    
    const size = productFixture.node.sizeSet[0]
    if (isDefined(size)) {
      void selectSize(size)
      expect(toValue(hasSelection)).toBe(true)
      expect(toValue(selectedSize)?.name).toBe('XS')

      reset()
      expect(toValue(hasSelection)).toBe(false)
      expect(toValue(selectedSize)).toBeUndefined()
    }
  })
})

describe('useSizeSelection buttonState', () => {
  beforeEach(() => {
    vi.stubGlobal('NODE_ENV', 'test')
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should return "selected" for the selected size', async () => {
    vi.stubGlobal('import', { meta: { server: false, client: true } })

    const component = await mountSuspended(defineComponent({
      template: `
      <div>
        <button v-for="size in availableSizes" :key="size.name" :data-state="buttonState(size).value" @click="selectSize(size)">
          Select size {{ size.name }}
        </button>
      </div>
      `,
      setup() {
        const { availableSizes, selectedSize, selectSize, buttonState } = useSizeSelection(productFixture)
        const size = productFixture.node.sizeSet[ 0 ]

        return {
          availableSizes,
          selectedSize,
          size,
          selectSize,
          buttonState,
        }
      }
    }))

    const buttonEls = component.findAll('button')
    expect(buttonEls).toHaveLength(productFixture.node.sizeSet.length)

    const unavailableButton = component.find('button[data-state="unavailable"]')
    expect(unavailableButton).toBeDefined()
  })
})

describe('useSizeSelected', () => {
  it('should return true if the size is selected', () => {
    const { selectedSize, selectSize } = useSizeSelection(productFixture)
    const size = productFixture.node.sizeSet[0]

    if (isDefined(selectedSize) && isDefined(size)) {
      void selectSize(size)

      const { isSelected } = useSizeSelected(toValue(selectedSize), productFixture)
      
      expect(isRef(isSelected)).toBe(true)
      expect(toValue(isSelected)).toBe(true)
    }
  })
})
