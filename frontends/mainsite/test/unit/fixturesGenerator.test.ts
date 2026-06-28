import { describe, it, expect } from 'vitest'
import { useGenerateProducts, IMAGE_GROUPS } from '../../layers/base/app/utils/__fixtures__'
import type { ProductNode } from '../../app/types'

describe.skip('Fixtures Generator - generateProducts', () => {
  it('should generate the correct number of products', async () => {
    const count = 5
    const products = useGenerateProducts(count)
    expect(products.value.data.allProducts.edges.length).toBe(count)

    products.value.data.allProducts.edges.forEach((edge: any) => {
      expect(edge.node).toHaveProperty('id')
      expect(edge.node).toHaveProperty('name')
      expect(edge.node).toHaveProperty('price')
    })
  })
})

// describe.skip('Fixtures Generator - generateImages', () => {
//   it('should generate the correct number of images', async () => {
//     const images = await generateImages(IMAGE_GROUPS.at(0))
//     expect(images.length).toBeGreaterThan(1)

//     images.forEach((image: ProductNode['node']['mainImage']) => {
//       expect(image).toHaveProperty('original')
//     })
//   })
// })
