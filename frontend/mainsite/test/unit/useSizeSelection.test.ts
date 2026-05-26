import { describe, vi, expect, it, afterEach, beforeEach } from 'vitest'
import { useSizeSelection } from '../../layers/base/app/composables/use/size'
import { productFixture } from '../../layers/base/app/utils/__fixtures__/products'

describe('useSizeSelection', () => {
  beforeEach(() => {
    vi.stubGlobal('NODE_ENV', 'test')
  })

  afterEach(() => {
    vi.resetAllMocks()
  })
  
  it.skip('should initialize with default values', () => {
    vi.stubGlobal('import', { meta: { server: true } })

    const { hasSelection, availableSizes } = useSizeSelection(productFixture)
    // console.log('hasSelection:', hasSelection)
    expect(hasSelection).toBeDefined()
    expect(toValue(hasSelection)).toBe(false)
    expect(isRef(availableSizes)).toBe(true)
    expect(toValue(availableSizes)).toEqual([])
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
      console.log(toValue(selectedSize))
    }
  })
})
