import type { Arrayable } from '~/types'
import type { BaseImage, Product, ProductNode } from '~/types/graphql'
import { productFixture, productGraphqlFixture } from '~/data/__fixtures__'

export const IMAGE_GROUPS = [
  [
    '/images/group1/img1.jpg',
    '/images/group1/img2.jpg',
    '/images/group1/img3.jpg',
    '/images/group1/img4.jpg'
  ],
  [
    '/images/group2/img1.jpg',
    '/images/group2/img2.jpg',
    '/images/group2/img3.jpg',
  ],
  [
    '/images/group3/img1.jpeg',
    '/images/group3/img2.jpeg',
    '/images/group3/img3.jpeg'
  ],
  [
    '/images/group4/img1.jpeg',
    '/images/group4/img2.jpeg',
    '/images/group4/img3.jpeg',
    '/images/group4/img4.jpeg'
  ],
  [
    '/images/group5/img1.jpeg',
    '/images/group5/img2.jpeg',
    '/images/group5/img3.jpeg'
  ]
]

function getRandomGroup() {
  const index = Math.floor(Math.random() * IMAGE_GROUPS.length)
  return IMAGE_GROUPS[index] as Arrayable<string>
}

export function generateImages(group: Arrayable<string>): Arrayable<BaseImage> {
  return group.map((imageUrl, i) => ({
    createdOn: '2025-01-01',
    isMainImage: i === 0,
    name: `Image ${i + 1}`,
    original: imageUrl,
    thumbnail: imageUrl,
    variant: 'default'
  }))
}

export function generateMainImage<T extends BaseImage>(group: Arrayable<string>): T {
  const imageUrl = group[0] as string
  return {
    createdOn: '2025-01-01',
    isMainImage: true,
    name: 'Main Image',
    original: imageUrl,
    thumbnail: imageUrl,
    variant: 'default'
  } as T
}

export function generateProducts(count = 3): Product {
  const container = { ...productGraphqlFixture }
  
  container.data.allProducts.edges = Array.from({ length: count }, (_, i) => {
    const randomGroup = getRandomGroup()
    const product: ProductNode = { ...productFixture }

    product.node.name = `Product Fixture ${i + 1}`
    product.node.mainImage = generateMainImage(randomGroup)
    product.node.productImages = generateImages(randomGroup)

    product.node.sizeSet = [
      {
        active: true,
        availability: true,
        metric: 'cm',
        name: 'S',
        variantPrice: 0
      },
      {
        active: true,
        availability: false,
        metric: 'cm',
        name: 'M',
        variantPrice: 5
      }
    ]

    return product
  })

  return container
}
