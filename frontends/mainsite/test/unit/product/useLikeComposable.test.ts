import { describe, it, expect, vi } from 'vitest'
import type { MaybeType, ProductNode } from '../../../app/types'
import { useSession } from '../../../layers/base/app/composables/use/session'

const product: MaybeType<ProductNode> = {
  node: {
    id: '123',
    name: 'Test Product',
    price: 19.99,
    ageGroupCategory: 'Adult',
    category: 'Test Category',
    collectionSet: {
      edges: [
        {
          node: {
            id: '456',
            name: 'Test Collection',
            slug: 'test-collection',
            subCategory: 'Test Subcategory',
            subcategorySlug: 'test-subcategory'
          }
        }
      ]
    },
    color: 'Red',
    description: 'This is a test product.',
    genderCategory: 'Unisex',
    colorVariants: [
      {
        id: '789',
        name: 'Blue',
        mainImage: {
          thumbnail: 'https://example.com/blue-thumbnail.jpg',
        }
      }
    ],
    video: null, 
    displayNew: true,
    hasSizes: true,
    isNew: true,
    mainImage: {
      id: '101112',
      thumbnail: 'https://example.com/main-thumbnail.jpg',
      isMainImage: true,
      name: 'Main Image',
      original: 'https://example.com/main-original.jpg',
      variants: null,
      createdOn: ''
    },
    modelHeight: 180,
    modelSize: 'M',
    modifiedOn: '',
    onSale: false,
    productImages: [
      {
        id: '131415',
        variant: '',
        thumbnail: 'https://example.com/image1-thumbnail.jpg',
        isMainImage: false,
        name: 'Image 1',
        original: 'https://example.com/image1-original.jpg',
        createdOn: ''
      }
    ],
    createdOn: ''
  }
}

// vi.mock<typeof import('../../../layers/base/app/composables/use/session')>(useSession, (original) => {
//   return {
//     ...original,
//     useSession: () => ({
//       docRef: {},
//       session: {
//         value: {
//           likedProducts: ['123']
//         }
//       }
//     })
//   }
// })

describe.todo('useLikeComposable', () => {
  it('should return all default values', () => {
    const result = useLikeComposable(product)
    expect(result).toBeDefined()
  })
})
