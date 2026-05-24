import type { BaseSizeSet, ProductNode } from '~/types'

/**
 * Composable to handle size selection for products. It will emit an 
 * event when the size is updated and will also keep track of the history of selected sizes.
 * @param product - The current product to select size for
 */
export const useSizeSelection = createGlobalState(<P extends ProductNode = ProductNode, S extends BaseSizeSet = BaseSizeSet>(product: P) => {
  if (import.meta.server) {
    return {
      hasSelection: ref(false),
      availableSizes: ref<S[]>([]),
      selectedSize: ref<S>(),
      history: ref<S[]>([]),
      hasSizes: ref(false),
      selectSize: () => {},
      reset: () => {},
      buttonState: (_size: S) => 'unavailable' as 'selected' | 'available' | 'unavailable',
    }
  }
  
  const _product = toValue(product)
  const availableSizes = computed(() => _product.node.sizeSet)

  const selectedSize = ref<BaseSizeSet>()
  const hasSelection = computed(() => isDefined(selectedSize))
  const { history } = useRefHistory(selectedSize)

  function _selectSize(size: S) {
    const canBeSelected = _product.node.hasSizes && size.availability

    if (canBeSelected) {
      selectedSize.value = size
    } else {
      console.warn(`Size ${size.name} is not available for selection.`)
    }
  }
  
  const selectSize = useThrottleFn(_selectSize, 200)

  function _reset() {
    selectedSize.value = undefined
  }

  const reset = useThrottleFn(_reset, 200)

  // TODO: Helper to check if a size was previously selected by the user
  // function wasSelected(size: S): boolean {
  //   return history.value.some(s => {
  //     return s.snapshot ? (s.snapshot.name === size.name) : false
  //   })
  // }

  function _buttonState(size: S): 'selected' | 'available' | 'unavailable' {
    if (isDefined(selectedSize) && selectedSize.value.name === size.name) {
      return 'selected'
    } else if (_product.node.hasSizes && size.availability) {
      return 'available'
    } else {
      return 'unavailable'
    }
  }

  const buttonState = reactify(_buttonState)

  return {
    /**
     * Indicates if a size has been selected
     * @default false
     */
    hasSelection,
    /**
     * The available sizes for the product
     * @default []
     */
    availableSizes,
    /**
     * The currently selected size
     * @default 'Unique'
     */
    selectedSize,
    /**
     * The history of selected sizes
     * @default []
     */
    history,
    /**
     * Updates the selected size
     * @param size - The size to select
     */
    selectSize,
    /**
     * Resets the selected size to 'Unique'
     */
    reset,
    /**
     * Determines the button state for a given size
     * @param size - The size to check
     * @returns The button state: 'selected', 'available', or 'unavailable'
     */
    buttonState
  }
})

/**
 * Composable to check if a specific size is selected for a product
 * @param size -  The size to check
 * @param product - The current product
 */
export function useSizeSelected(size: BaseSizeSet, product: ProductNode) {
  const { selectedSize } = useSizeSelection(product)
  const isSelected = computed(() => isDefined(selectedSize) ? selectedSize.value.name === size.name : false)

  return {
    isSelected
  }
}
