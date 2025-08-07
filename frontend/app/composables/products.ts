import type { DefaultClotheSize } from '~/data'
import type { Product, ProductSizes } from '~/types'

/**
 * Composable to handle product bookmarking
 */
export function useBookmarkProduct(product: Product) {}

/**
 * Composable to handle the grid size for displaying products
 */
export function useHandleGridSize() {
  if (import.meta.client) {
    const gridSize = useLocalStorage('grid', 3)

    function update(size: number) {
      gridSize.value = size
    }

    return {
      /**
       * The current grid size for displaying products
       * @default 3
       */
      gridSize,
      /**
       * Updates the grid size for displaying products
       */
      update
    }
  } else {
    return {
      gridSize: 3,
      update: (size: number) => {
        // No-op on server-side
      }
    }
  }
}

/**
 * Composable to handle size selection for products. Itwill emit an 
 * event when the size is updated
 * @param product - The current product to select size for
 */
export function useSizeSelection<T extends Product = Product>(product: T) {
  const currentProduct = reactive<T>(product)
  const availableSizes = ref<DefaultClotheSize[]>(product.sizes.map(item => item.name))

  const emit = defineEmits<{ 'update-size': [size: DefaultClotheSize] }>()

  const selectedSize = ref<DefaultClotheSize>('Unique')
  const { history } = useRefHistory(selectedSize)

  /**
   * Funcion to select a size for the product It checks if the size is available
   * and allows the user to select it
   * @param size - The size to select
   */
  function selectSize(size: ProductSizes) {
    const canBeSelected = currentProduct.has_sizes && size.availability

    selectedSize.value = size.name
    emit('update-size', size.name)
  }

  function reset() {
    selectedSize.value = 'Unique'
    emit('update-size', 'Unique')
  }

  const hasSizes = computed(() => currentProduct.has_sizes)

  // watchDebounced(selectedSize, (newSize) => {
  //   emit('update-size', newSize)
  // }, 500)

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
     * Indicates if the product has sizes available
     */
    hasSizes,
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
}

/**
 * Composable to check if a specific size is selected for a product
 * @param sizeName - The name of the size to check
 * @param product - The current product
 */
export function useSizeSelected(sizeName: DefaultClotheSize, product: Product) {
  const { selectedSize } = useSizeSelection(product)
  const isSelected = computed(() => selectedSize.value === sizeName)

  return {
    isSelected
  }
}
