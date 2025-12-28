import { test } from 'vitest'

export * from './errors'
export * from './use'

export async function useForTesting() {
  const data = await $fetch<[]>('https://jsonplaceholder.typicode.com/todos/1', {
    method: 'GET',
  })

  function _test() {
    return 'test'
  }

  provideLocal('a', 1)

  return {
    _test,
    data
  }
}
