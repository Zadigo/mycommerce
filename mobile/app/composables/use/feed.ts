export function useProductsFeed() {
  return {
    products: [],
    fetch: () => Promise.resolve(Array.from({ length: 100 }, (_, i) => ({id: i + 1, name: `Product ${i + 1}`})))
  }
}
