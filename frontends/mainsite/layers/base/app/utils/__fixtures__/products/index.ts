import { faker } from '@faker-js/faker'
import { isDefined } from '@vueuse/core'
import { ref } from 'vue'
import type { BaseImage, Product, ProductNode } from '~/types/graphql'

export const productFixture: ProductNode = {
  node: {
    id: faker.number.int().toString(),
    name: faker.commerce.productName(),
    category: 'Skirts',
    color: 'Pink',
    createdOn: faker.date.past().toISOString(),
    genderCategory: 'Woman',
    ageGroupCategory: 'Adult',
    displayNew: faker.datatype.boolean({ probability: 0.2 }),
    hasSizes: true,
    isNew: faker.datatype.boolean({ probability: 0.2 }),
    modelHeight: null,
    modelSize: null,
    modifiedOn: faker.date.past().toISOString(),
    onSale: faker.datatype.boolean({ probability: 0.1 }),
    unitPrice: 100,
    subCategory: 'Skirts subcategory',
    slug: faker.lorem.slug(),
    sku: faker.string.alphanumeric(8).toUpperCase(),
    salePrice: 80,
    price: faker.number.float({ min: 20, max: 100 }),
    saleValue: 20,
    mainImage: {
      id: faker.number.int().toString(),
      createdOn: faker.date.past().toISOString(),
      isMainImage: true,
      name: 'main-image.jpg',
      original: '/images/main-image.jpg',
      thumbnail: '/images/main-image-thumb.jpg',
      variant: 'pink-something'
    },
    productImages: [
      {
        id: faker.number.int().toString(),
        createdOn: faker.date.past().toISOString(),
        isMainImage: true,
        name: 'main-image.jpg',
        original: '/images/main-image.jpg',
        thumbnail: '/images/main-image-thumb.jpg',
        variant: 'pink-something'
      }
    ],
    collectionSet: {
      edges: []
    },
    sizeSet: [
      {
        active: true,
        availability: true,
        metric: 'Clothe',
        name: 'XS',
        variantPrice: 80
      },
      {
        active: true,
        availability: true,
        metric: 'Clothe',
        name: 'S',
        variantPrice: 80
      }
    ],
    video: null,
    colorVariants: [
      {
        id: faker.number.int().toString(),
        name: 'Variant Pink',
        mainImage: {
          thumbnail: '/images/group1/img1.jpg'
        }
      }
    ]
  }
}

export const productGraphqlFixture: Product = {
  data: {
    allProducts: {
      edges: []
    }
  }
}

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

export function useGenerateProducts(count = 10): Ref<Product> {
  const node = ref(productGraphqlFixture)

  node.value.data.allProducts.edges = Array.from({ length: count }, (_, _i) => {
    const randomGroup = faker.number.int({ min: 1, max: 7 })
    const imageGroup = IMAGE_GROUPS[randomGroup]

    const fixture = JSON.parse(JSON.stringify(productFixture)) as ProductNode
    
    fixture.node.id = faker.number.int().toString()
    fixture.node.name = faker.commerce.productName()
    fixture.node.price = faker.number.float({ min: 20, max: 100 })
    fixture.node.saleValue = fixture.node.salePrice ? fixture.node.price - fixture.node.salePrice : 0
    fixture.node.slug = faker.lorem.slug()
    fixture.node.displayNew = faker.datatype.boolean({ probability: 0.2 })
    fixture.node.onSale = faker.datatype.boolean({ probability: 0.1 })
    fixture.node.isNew = faker.datatype.boolean({ probability: 0.5 })

    if (isDefined(imageGroup)) {
      const images = imageGroup.map((url, index) => ({
        id: faker.number.int().toString(),
        createdOn: faker.date.past().toISOString(),
        isMainImage: index === 0,
        name: faker.system.fileName(),
        original: url,
        thumbnail: url,
        variant: faker.commerce.productAdjective() + '-' + faker.commerce.productMaterial()
      } as BaseImage))
      fixture.node.productImages = images
    }

    fixture.node.sizeSet = [
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

    return fixture
  })
  return node
}
