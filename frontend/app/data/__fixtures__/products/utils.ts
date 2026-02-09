import { productFixture, productGraphqlFixture } from '~/data/__fixtures__'
import type { Arrayable } from '~/types'
import type { BaseImage, ProductNode } from '~/types/graphql'
import { faker } from '@faker-js/faker'

export const IMAGE_GROUPS: Record<number, string[]> = {
  1: [
    '/images/group1/img1.jpg',
    '/images/group1/img2.jpg',
    '/images/group1/img3.jpg',
    '/images/group1/img4.jpg'
  ],
  2: [
    '/images/group2/img1.jpg',
    '/images/group2/img2.jpg',
    '/images/group2/img3.jpg',
  ],
  3: [
    '/images/group3/img1.jpeg',
    '/images/group3/img2.jpeg',
    '/images/group3/img3.jpeg'
  ],
  4: [
    '/images/group4/img1.jpeg',
    '/images/group4/img2.jpeg',
    '/images/group4/img3.jpeg',
    '/images/group4/img4.jpeg'
  ],
  5: [
    '/images/group5/img1.jpeg',
    '/images/group5/img2.jpeg',
    '/images/group5/img3.jpeg'
  ],
  6: [
    '/images/group6/img1.jpg',
    '/images/group6/img2.jpg',
    '/images/group6/img3.jpg',
    '/images/group6/img4.jpg',
    '/images/group6/img5.jpg'
  ],
  7: [
    '/images/group7/img1.jpg',
    '/images/group7/img2.jpg',
    '/images/group7/img3.jpg',
    '/images/group7/img4.jpg',
    '/images/group7/img5.jpg',
    '/images/group7/img6.jpg'
  ]
}

function getRandomGroup() {
  const index = Math.floor(Math.random() * Object.keys(IMAGE_GROUPS).length) + 1
  return IMAGE_GROUPS[index]
}

export function generateImages(group: Arrayable<string> | undefined): Arrayable<BaseImage> {
  if (!group) {
    const _group = IMAGE_GROUPS[1] as string[]
    
    return _group.map((imageUrl, i) => ({
        id: (i + 1).toString(),
        createdOn: '2025-01-01',
        isMainImage: i === 0,
        name: `Image ${i + 1}`,
        original: imageUrl,
        thumbnail: imageUrl,
        variant: 'default'
      }))
    }

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

export function generateMainImage<T extends BaseImage>(group: Arrayable<string> | undefined): T {
  if (group) {
    const imageUrl = group[0]
    return {
      createdOn: '2025-01-01',
      isMainImage: true,
      name: 'Main Image',
      original: imageUrl,
      thumbnail: imageUrl,
      variant: 'default'
    } as T
  } else {
    return {
      createdOn: '2025-01-01',
      isMainImage: true,
      name: 'Main Image',
      original: '/images/group6/img1.jpg',
      thumbnail: '/images/group6/img1.jpg',
      variant: 'default'
    } as T
  }
}

export async function generateProducts(count = 3) {
  const container = { ...productGraphqlFixture }

  const items: ProductNode[] = []

  for (let i = 0; i < count; i++) {
    const randomGroup = getRandomGroup()
    const newItem: ProductNode = { ...productFixture }

    console.log('Random group for product:', newItem)

    newItem.node.mainImage = generateMainImage(randomGroup)
    newItem.node.productImages = generateImages(randomGroup)
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
