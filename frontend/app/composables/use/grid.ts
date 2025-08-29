/**
 * Composable to handle changes to the size of the grid
 */
export function useHandleGridSize() {
  if (import.meta.server) {
    return {
      currentGridSize: ref<number>(3),
      handleGridSize: () => { }
    }
  }

  const currentGridSize = useLocalStorage('grid', 3)

  /**
   * Changes the size of the grid to
   * reduce or increase the amount of
   * products displayed on the screen
   */
  function handleGridSize(grid: number, callback?: () => void) {
    currentGridSize.value = grid
    if (callback) callback()
  }

  const threeState = computed(() => currentGridSize.value === 3 ? 'light' : 'ghost')
  const fourState = computed(() => currentGridSize.value === 4 ? 'light' : 'ghost')

  return {
    threeState,
    fourState,
    /**
     * The current size of the grid
     */
    currentGridSize,
    /**
     * Function to handle changes to the grid size
     */
    handleGridSize
  }
}
