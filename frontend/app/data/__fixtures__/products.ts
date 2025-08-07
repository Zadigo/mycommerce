import type { Product, ProductsApiResponse } from '~/types'

export const productFixture: Product = {
  id: 1,
  name: 'Some Name',
  active: true,
  category: 'Skirts',
  color: 'Pink',
  color_variant_name: 'pink-something',
  created_on: '2025-1-1',
  display_new: true,
  get_main_image: {
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
  },
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
      availability: true
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

export const productApiResponseFixture: ProductsApiResponse = {
  count: 1,
  limit: 30,
  next: null,
  previous: null,
  results: [
    productFixture
  ] 
}
