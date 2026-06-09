import type { ProductCollection } from '~/types'

export const collectionRestApiFixture: ProductCollection = {
  data: {
    allCollections: [
      {
        name: 'Summer Collection',
        viewName: 'Summer Collection 2024',
        category: 'Seasonal',
        description: 'A vibrant collection perfect for the summer season.',
        illustration: 'https://example.com/images/summer-collection.jpg',
        numberOfItems: 25,
        slug: 'summer-collection',
        subCategory: 'Clothing',
        subcategorySlug: 'clothing',
        tags: ['summer', '2024', 'clothing'],
        createdOn: '2024-05-01T10:00:00Z'
      },
      {
        name: 'Winter Essentials',
        viewName: 'Winter Essentials 2024',
        category: 'Seasonal',
        description: 'Stay warm with our winter essentials collection.',
        illustration: 'https://example.com/images/winter-essentials.jpg',
        numberOfItems: 30,
        slug: 'winter-essentials',
        subCategory: 'Clothing',
        subcategorySlug: 'clothing',
        tags: ['winter', '2024', 'clothing'],
        createdOn: '2024-11-15T10:00:00Z'
      }
    ]
  }
}
