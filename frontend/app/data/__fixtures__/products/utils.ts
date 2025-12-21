import { productFixture, productGraphqlFixture } from '~/data/__fixtures__'
import type { Arrayable } from '~/types'
import type { BaseImage, ProductNode } from '~/types/graphql'

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

async function getRandomGroup() {
  const index = Math.floor(Math.random() * IMAGE_GROUPS.length)
  console.log('Selected image group index:', index)
  return IMAGE_GROUPS[index] as Arrayable<string>
}

export async function generateImages(group: Arrayable<string>): Promise<Arrayable<BaseImage>> {
  return group.map((imageUrl, i) => ({
    id: (i + 1).toString(),
    createdOn: '2025-01-01',
    isMainImage: i === 0,
    name: `Image ${i + 1}`,
    original: imageUrl,
    thumbnail: imageUrl,
    variant: 'default'
  }))
}

export async function generateMainImage<T extends BaseImage>(group: Arrayable<string>): Promise<T> {
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

export async function generateProducts(count = 3) {
  const container = { ...productGraphqlFixture }

  const items: ProductNode[] = []

  for (let i = 0; i < count; i++) {
    const randomGroup = await getRandomGroup()
    const newItem: ProductNode = { ...productFixture }

    newItem.node.id = (i + 1).toString()
    newItem.node.name = `Product Fixture ${i + 1}`
    newItem.node.mainImage = await generateMainImage(randomGroup)
    newItem.node.productImages = await generateImages(randomGroup)
    newItem.node.unitPrice = 50 + i * 10
    newItem.node.price = newItem.node.unitPrice
    newItem.node.saleValue = newItem.node.salePrice ? newItem.node.unitPrice - (newItem.node.salePrice) : 0

    newItem.node.sizeSet = [
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

    items.push(newItem)
  }

  container.data.allProducts.edges = items
  return container
}
