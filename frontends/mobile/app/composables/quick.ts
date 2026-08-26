export function useSimpleComposable() {
  const state = ref<number>(0)

  function increment() {
    state.value++
  }

  return {
    state,
    increment
  }
}
