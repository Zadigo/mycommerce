import type { Arrayable, Product, ProductsApiResponse } from '~/types'

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

export function generateImages(group: Arrayable<string>): Product['images'] {
  return group.map((imageUrl, i) => ({
    id: i + 1,
    name: `Image ${i + 1}`,
    is_main_image: i === 0,
    mid_size: imageUrl,
    original: imageUrl,
    thumbnail: imageUrl,
    product_set: [
      {
        id: 1,
        color: 'Pink',
        color_variant_name: 'Pink',
        name: 'Pink'
      }
    ]
  }))
}

export function generateMainImage() {
  const group = IMAGE_GROUPS[Math.floor(Math.random() * IMAGE_GROUPS.length)]

  if (group) {
    const imageUrl = group[0]

    if (imageUrl) {
      const item = {
        id: 1,
        name: 'Image',
        is_main_image: true,
        mid_size: imageUrl,
        original: imageUrl,
        thumbnail: imageUrl,
        product_set: [
          {
            id: 1,
            color: 'Pink',
            color_variant_name: 'Pink',
            name: 'Pink'
          }
        ]
      }

      return [group, item]
    }
  }

  return [null, null]
}

export function generateProducts(count = 3): Product[] {

  return Array.from({ length: count }, (_, i) => {
    const [selectedGroup, mainImage] = generateMainImage()

    const product = {
      ...productFixture,

      id: i + 1,
      name: `Product Fixture ${i + 1}`,
      get_main_image: mainImage,
      images: generateImages(selectedGroup)
    }

    return product
  })
}
