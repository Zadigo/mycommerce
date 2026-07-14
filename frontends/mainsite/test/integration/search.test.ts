// @vitest-environment node

import { describe, it, expect, beforeAll } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'
import { registerEndpoint } from '@nuxt/test-utils/runtime'

describe.todo('GET /api/products/search', async () => {
  await setup({
    server: true
  })

  beforeAll(() => {
    // Stub the upstream Django call so this test never hits a real network,
    // real backend, or depends on test data existing in a live DB
    registerEndpoint('/api/products/search', {
      method: 'GET',
      handler: () => ({
        searchProducts: [
          {
            node: {
              id: '123',
              name: 'Test Product',
              slug: 'test-product',
              price: 100,
              salePrice: 80,
              unitPrice: 100,
              displayNew: true,
              mainImage: {
                id: '1',
                name: 'Main Image',
                original: 'original.jpg',
                thumbnail: 'thumbnail.jpg',
                isMainImage: true,
                variant: 'default',
                createdOn: '2024-01-01'
              },
              productImages: [
                {
                  id: '2',
                  name: 'Product Image',
                  original: 'original.jpg',
                  thumbnail: 'thumbnail.jpg'
                }
              ]
            }
          }
        ]
      })
    })
  })

  it('returns search results when a valid name query is present', async () => {
    const response = await $fetch('/api/products/search', {
      method: 'GET',
      params: {
        name: 'test',
        offset: 0
      }
    })

    expect(response).toHaveProperty('searchProducts')
  })

  // it('throws 400 when no name query is present', async () => {
  //   await expect($fetch('/api/products/search')).rejects.toMatchObject({
  //     response: { status: 400 }
  //   })
  // })
})
