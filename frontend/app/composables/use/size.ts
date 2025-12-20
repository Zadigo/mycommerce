import type { BaseSizeSet, ProductNode } from '~/types'

/**
 * Composable to handle size selection for products. It will emit an 
 * event when the size is updated
 * @param product - The current product to select size for
 */
export const useSizeSelection = createGlobalState(<P extends ProductNode = ProductNode, S extends BaseSizeSet = BaseSizeSet>(product: P) => {
  if (import.meta.server) {
    return {
      availableSizes: ref<S[]>([]),
      selectedSize: ref<S>(),
      history: ref<S[]>([]),
      hasSizes: ref(false),
      selectSize: () => {},
      reset: () => {}
    }
  }
  
  const _product = toValue(product)
  const availableSizes = computed(() => _product.node.sizeSet)

  const selectedSize = ref<BaseSizeSet>()
  const { history } = useRefHistory(selectedSize)

  /**
   * Funcion to select a size for the product It checks if the size is available
   * and allows the user to select it
   * @param size - The size to select
   */
  function _selectSize(size: S) {
    const canBeSelected = _product.node.hasSizes && size.availability

    if (canBeSelected) {
      selectedSize.value = size
    } else {
      console.warn(`Size ${size.name} is not available for selection.`)
    }
  }

  function _reset() {
    selectedSize.value = undefined
  }

  const selectSize = useThrottleFn(_selectSize, 200)
  const reset = useThrottleFn(_reset, 200)

  return {
    /**
     * The available sizes for the product
     */
    availableSizes,
    /**
     * The currently selected size
     * @default 'Unique'
     */
    selectedSize,
    /**
     * The history of selected sizes
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
    reset
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
