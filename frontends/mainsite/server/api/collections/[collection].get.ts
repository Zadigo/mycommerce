import { Product } from '~/types/graphql/products'
import { useGenerateProducts } from '~~/layers/base/app/utils/__fixtures__' 

export default defineEventHandler(async (_event): Promise<Product> => {
  try {
    return useGenerateProducts(12).value
  } catch (e) {
    console.error('Error generating products:', e)
    return { data: { allProducts: { edges: [] } } }
  }
})
