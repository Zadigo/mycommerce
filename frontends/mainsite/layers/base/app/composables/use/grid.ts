/**
 * Composable to handle changes to the size of the grid
 */
export const useHandleGridSize = createGlobalState(() => {
  if (import.meta.server) {
    return {
      threeState: ref<string>('light'),
      fourState: ref<string>('light'),
      gridClass: ref<string>('grid grid-cols-4 gap-2 px-1'),
      currentGridSize: ref<number>(3),
      handleGridSize: () => { }
    }
  } else {
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
          'grid-cols-1 md:grid-cols-1 lg:grid-cols-3': currentGridSize.value === 3,
          'grid-cols-2 xl:grid-cols-4': currentGridSize.value === 4
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
})
