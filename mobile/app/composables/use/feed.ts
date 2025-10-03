import { productApiResponseFixture } from '~/data/__fixtures__'

export function useProductsFeed() {
  return {
    products: [],
    fetch: () => Promise.resolve(productApiResponseFixture.results)
  }
}
