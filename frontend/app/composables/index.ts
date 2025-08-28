export * from './use'

export function googleAnalytics(a: number) {
  console.log('Google Analytics', a)
  return a
}

export async function testFunction(w: number = 1) {
 const a =  googleAnalytics(w)
 return a
  // const { data } =  await useFetch<{ title: string }>('/todos/1', {
  //   baseURL: 'https://jsonplaceholder.typicode.com',
  //   method: 'GET',
  //   immediate: true
  // })

  // console.log(data.value)
}
