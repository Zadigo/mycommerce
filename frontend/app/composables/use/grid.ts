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

  const currentGridSize = useLocalStorage('grid', 4)

  function handleGridSize(grid: number, callback?: () => void) {
    currentGridSize.value = grid
    if (callback) callback()
  }

  const threeState = computed(() => currentGridSize.value === 3 ? 'light' : 'ghost')
  const fourState = computed(() => currentGridSize.value === 4 ? 'light' : 'ghost')

  const gridClass = computed(() => {
    return [
      'grid gap-2 px-1',
      {
        'grid-cols-2 md:grid-cols-4': currentGridSize.value === 3,
        'grid-cols-3 md:grid-cols-3': currentGridSize.value === 4
      }
    ]
  })

  return {
    threeState,
    fourState,
    gridClass,
    /**
     * The current size of the grid
     * @default 3
     */
    currentGridSize,
    /**
     * Function to handle changes to the grid size
     */
    handleGridSize
  }
}
