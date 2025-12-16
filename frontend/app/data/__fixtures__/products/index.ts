// import type { Arrayable, Product, ProductsApiResponse } from '~/types'

// export const productFixture: Product = {
//   id: 1,
//   name: 'Product Fixture',
//   active: true,
//   category: 'Skirts',
//   color: 'Pink',
//   color_variant_name: 'pink-something',
//   created_on: '2025-1-1',
//   display_new: true,
//   get_main_image: null,
//   get_price: '1',
//   has_sizes: true,
//   images: [
//     {
//       id: 1,
//       name: 'Google',
//       is_main_image: true,
//       mid_size: '/image.jpeg',
//       original: '/image.jpeg',
//       thumbnail: '/image.jpeg',
//       product_set: [
//         {
//           id: 1,
//           color: 'Pink',
//           color_variant_name: 'Pink',
//           name: 'Pink'
//         }
//       ]
//     }
//   ],
//   is_new: true,
//   model_height: '165',
//   model_size: '45',
//   modified_on: '2025-1-1',
//   on_sale: true,
//   sale_price: '45',
//   sale_value: 4,
//   sizes: [
//     {
//       id: 1,
//       name: 'XS',
//       metric: 'Clothe',
//       availability: true,
//       active: true
//     },
//     {
//       id: 2,
//       name: 'S',
//       metric: 'Clothe',
//       availability: true,
//       active: true
//     },
//     {
//       id: 3,
//       name: 'M',
//       metric: 'Clothe',
//       availability: false,
//       active: false
//     }
//   ],
//   sku: '345',
//   slug: 'slug',
//   sub_category: 'some',
//   unit_price: '34',
//   variants: [],
//   collection_set: [
//     {
//       id: 1,
//       name: 'Some Name',
//       category: 'C',
//       get_view_name: 'c',
//       illustration: 'Some',
//       number_of_items: 1,
//       sub_category: 'w',
//       tags: ['Skirt']
//     }
//   ]
// }

// export const productsApiResponseFixture: ProductsApiResponse = {
//   count: 1,
//   limit: 30,
//   next: null,
//   previous: null,
//   results: generateProducts(100)
// }


import type { Product, ProductNode } from '~/types/graphql'

export const productFixture: ProductNode = {
  node: {
    id: '1',
    name: 'Product GraphQL Fixture',
    category: 'Skirts',
    color: 'Pink',
    createdOn: '2025-1-1',
    genderCategory: 'Woman',
    ageGroupCategory: 'Adult',
    displayNew: true,
    hasSizes: true,
    isNew: true,
    modelHeight: null,
    modelSize: null,
    modifiedOn: '2025-1-1',
    onSale: true,
    unitPrice: 100,
    subCategory: 'some',
    slug: 'slug',
    sku: '345',
    salePrice: 80,
    price: 100,
    saleValue: 20,
    mainImage: {
      createdOn: '2025-1-1',
      isMainImage: true,
      name: 'main-image.jpg',
      original: '/images/main-image.jpg',
      thumbnail: '/images/main-image-thumb.jpg',
      variant: 'pink-something'
    },
    productImages: [
      {
        createdOn: '2025-1-1',
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
        id: '2',
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
      edges: [
        productFixture
      ]
    }
  }
}
