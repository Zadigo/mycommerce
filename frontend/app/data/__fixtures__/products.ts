import type { Arrayable, Product, ProductsApiResponse } from '~/types'

const IMAGE_GROUPS = [
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

export const productFixture: Product = {
  id: 1,
  name: 'Product Fixture',
  active: true,
  category: 'Skirts',
  color: 'Pink',
  color_variant_name: 'pink-something',
  created_on: '2025-1-1',
  display_new: true,
  get_main_image: null,
  get_price: '1',
  has_sizes: true,
  images: [
    {
      id: 1,
      name: 'Google',
      is_main_image: true,
      mid_size: '/image.jpeg',
      original: '/image.jpeg',
      thumbnail: '/image.jpeg',
      product_set: [
        {
          id: 1,
          color: 'Pink',
          color_variant_name: 'Pink',
          name: 'Pink'
        }
      ]
    }
  ],
  is_new: true,
  model_height: '165',
  model_size: '45',
  modified_on: '2025-1-1',
  on_sale: true,
  sale_price: '45',
  sale_value: 4,
  sizes: [
    {
      id: 1,
      name: 'XS',
      metric: 'Clothe',
      availability: true,
      active: true
    },
    {
      id: 2,
      name: 'S',
      metric: 'Clothe',
      availability: true,
      active: true
    },
    {
      id: 3,
      name: 'M',
      metric: 'Clothe',
      availability: false,
      active: false
    }
  ],
  sku: '345',
  slug: 'slug',
  sub_category: 'some',
  unit_price: '34',
  variants: [],
  collection_set: [
    {
      id: 1,
      name: 'Some Name',
      category: 'C',
      get_view_name: 'c',
      illustration: 'Some',
      number_of_items: 1,
      sub_category: 'w',
      tags: ['Skirt']
    }
  ]
}

function generateImages(group: Arrayable<string>): Product['images'] {
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

function generateMainImage() {
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

      return [group , item]
    }
  }

  return [null, null]
}

function generateProducts(count = 3): Product[] {
  
  return Array.from({ length: count }, (_, i) => {
    const [selectedGroup, mainImage] = generateMainImage()
    
    const product =  {
      ...productFixture,

      id: i + 1,
      name: `Product Fixture ${i + 1}`,
      get_main_image: mainImage,
      images: generateImages(selectedGroup)
    }

    return product
  })
}

export const productsApiResponseFixture: ProductsApiResponse = {
  count: 1,
  limit: 30,
  next: null,
  previous: null,
  results: generateProducts(100)
}
