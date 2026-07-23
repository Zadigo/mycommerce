import type { ProductRecommendations } from '~/types'

export function getRecommendations(): ProductRecommendations {
  return {
    data: {
      recommendations: [
        {
          id: '1',
          name: 'Product 1',
          slug: 'product-1',
          price: 10.99,
          salePrice: 9.99,
          unitPrice: 10.99,
          displayNew: true,
          genderCategory: 'Man',
          colorVariants: [],
          hasSizes: true,
          isNew: true,
          modelHeight: 180,
          modelSize: 'M',
          onSale: true,
          saleValue: 1.00,
          sizeSet: [],
          sku: 'SKU001',
          subCategory: 'Shirts',
          video: null,
          modifiedOn: '2023-01-01T00:00:00Z',
          ageGroupCategory: 'Adult',
          category: 'Clothing',
          collectionSet: {
            edges: [],
          },
          color: 'Red',
          createdOn: '2023-01-01T00:00:00Z',
          mainImage: {
            id: '1',
            name: 'image1.jpg',
            original: 'https://example.com/image1.jpg',
            thumbnail: 'https://example.com/image1_thumb.jpg',
            isMainImage: true,
            variant: 'Red',
            createdOn: '2023-01-01T00:00:00Z'
          },
          productImages: [
            {
              id: '1',
              name: 'image1.jpg',
              original: 'https://example.com/image1.jpg',
              thumbnail: 'https://example.com/image1_thumb.jpg',
              createdOn: '2023-01-01T00:00:00Z',
              isMainImage: true,
              variant: 'Red'
            }
          ]
        }
      ]
    }
  }
}
