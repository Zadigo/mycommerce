// // import _ from "lodash"

// function buildImagePath (path, mediaPrefix = false, local = false) {
//   let url

//   if (path === null || typeof path === 'undefined') {
//     const image = new URL(`./assets/placeholder.svg`, import.meta.url)
//     return image.toString()
//   }

//   if (local) {
//     const image = new URL(`./assets/${path}`, import.meta.url)
//     return image.toString()
//   }

//   if (import.meta.env.DEV) {
//     url = import.meta.env.VITE_DEVELOPMENT_URL
//   } else {
//     url = import.meta.env.VITE_PRODUCTION_URL
//   }

//   if (mediaPrefix) {
//     url += '/media/'
//   }


//   const finalUrl = new URL(path, url)
//   return finalUrl.toString()
// }

// function createMockupProducts (s = 30) {
//   // const image = new URL('./assets/placeholder.svg', import.meta.url).href
//   const image = buildImagePath('placeholder.svg', false, true)

//   const products = Array.from({ length: s }, (k, v) => ({
//     id: v + 1,
//     name: `Soutien-gorge corbeille ${v + 1}`,
//     color: 'White',
//     category: 'A-line',
//     description: 'Discover how to use Schema.org',
//     images: [
//       {
//         id: 1429,
//         name: "Jupe Cargo",
//         product_set: [
//           {
//             id: 1105,
//             name: "Jupe Cargo LanièRes"
//           }
//         ],
//         original: image,
//         thumbnail: image,
//         mid_size: image
//       }
//     ],
//     // sizes: [ 'XS', 'S', 'M' ],
//     sizes: [
//       {
//         id: 1,
//         name: 'XS',
//         sub_category: 'Clothe size',
//         availability: true,
//       },
//       {
//         id: 2,
//         name: 'S',
//         sub_category: 'Clothe size',
//         availability: true,
//       },
//       {
//         id: 3,
//         name: 'M',
//         sub_category: 'Clothe size',
//         availability: false,
//       }
//     ],
//     variants: [1, 2],
//     get_main_image: {
//       id: 1430,
//       name: "Jupe Cargo 2",
//       product_set: [
//         {
//           id: 1105,
//           name: "Jupe Cargo LanièRes"
//         }
//       ],
//       original: image,
//       thumbnail: image,
//       mid_size: image
//     },
//     slug: `soutien-gorge-corbeille-${v + 1}`,
//     get_price: 45.93,
//     price: 45.93,
//     active: true
//   }))
//   return products
// }

// function createMockupProduct (id = null, s = 30) {
//   const products = createMockupProducts(s)
//   if (id) {
//     return products[id * 1 + 1]
//   } else {
//     const randomIndex = Math.floor(Math.random() * s) + 1
//     return products[randomIndex]
//   }
// }

// export {
//   buildImagePath,
//   createMockupProduct,
//   createMockupProducts
// }



// /**
//  * A special composable that generates products
//  * for testing purposes 
//  */
// export function useMockups () {
//   const testProducts = ref({})
//   const { djangoMediaPath } = useUtilities()

//   /**
//    * 
//    * @param {number} [size=100] The number of products to create
//    * @returns {Object[]} List of products
//    * @returns {Number} returns.id The product ID 
//    */
//   function createMockupProducts (size = 100) {
//     const image = djangoMediaPath('placeholder.svg', false, true)

//     const products = Array.from({ length: size }, (k, v) => ({
//       id: v + 1,
//       name: `Soutien-gorge corbeille ${v + 1}`,
//       color: 'White',
//       category: 'A-line',
//       description: 'Discover how to use Schema.org',
//       images: [
//         {
//           id: 1429,
//           name: "Jupe Cargo",
//           product_set: [
//             {
//               id: 1105,
//               name: "Jupe Cargo LanièRes"
//             }
//           ],
//           original: image,
//           thumbnail: image,
//           mid_size: image
//         }
//       ],
//       // sizes: [ 'XS', 'S', 'M' ],
//       sizes: [
//         {
//           id: 1,
//           name: 'XS',
//           sub_category: 'Clothe size',
//           availability: true,
//         },
//         {
//           id: 2,
//           name: 'S',
//           sub_category: 'Clothe size',
//           availability: true,
//         },
//         {
//           id: 3,
//           name: 'M',
//           sub_category: 'Clothe size',
//           availability: false,
//         }
//       ],
//       variants: [1, 2],
//       get_main_image: {
//         id: 1430,
//         name: "Jupe Cargo 2",
//         product_set: [
//           {
//             id: 1105,
//             name: "Jupe Cargo LanièRes"
//           }
//         ],
//         original: image,
//         thumbnail: image,
//         mid_size: image
//       },
//       slug: `soutien-gorge-corbeille-${v + 1}`,
//       get_price: 45.93,
//       price: 45.93,
//       active: true
//     }))

//     testProducts.value = products
//     return products
//   }

//   /**
//    * 
//    * Get a specific product ID or return a random
//    * item in the created list of products
//    * 
//    * @param {String | Number} [id=null] 
//    */
//   function createMockupProduct (id = null) {
//     const products = createMockupProducts()
//     if (id) {
//       return products[id * 1 + 1]
//     } else {
//       const randomIndex = Math.floor(Math.random() * products.length) + 1
//       return products[randomIndex]
//     }
//   }


//   return {
//     testProducts,
//     createMockupProduct,
//     createMockupProducts
//   }
// }

import { useVueLocalStorage } from '../plugins/vue-storages/local-storage'
import { computed, onBeforeMount, ref } from 'vue'

export function useCollectionMockup () {
  const productCollections = computed(() => {
    return Array.from({ length: 5 }, (a, b) => {
      return {
        id: b,
        name: `Collection ${b}`,
        category: '',
        sub_category: '',
        number_of_items: '',
        illustration: '',
        tags: [],
        get_view_name: ''
      }
    })
  })

  return {
    productCollections
  }
}

export function useMockups () {
  const mockupProducts = ref([])
  const mockupProduct = ref({})
  const currentDate = ref(new Date().toString())
  const maxProducts = ref(30)

  const { instance } = useVueLocalStorage()

  const productImages = computed(() => {
    return Array.from({ length: 5 }, (a, b) => {
      return {
        id: b,
        name: `Image ${b}`,
        product_set: [],
        original: 'http://placeholder.com',
        thumbnail: 'http://placeholder.com',
        mid_size: 'http://placeholder.com'
      }
    })
  })

  function createSizes () {
    return Array.from({ length: 3 }, (a, b) => {
      return {
        id: b,
        name: 'XS',
        sub_category: 'Skirt',
        availability: true
      }
    })
  }

  function generateProducts (k = 30) {
    const images = productImages.value

    const randomIndex = Math.floor(Math.random() * images.length) + 1
    const mainImage = images[randomIndex]

    Array.from({ length: k }, (a, b) => {
      mockupProducts.value.push({
        id: b,
        name: `Product ${b}`,
        color: 'Red',
        category: '',
        sub_category: '',
        sizes: createSizes(),
        has_sizes: true,
        get_price: 1,
        sale_value: 1,
        sale_price: 1,
        on_sale: true,
        collection_set: [],
        get_main_image: mainImage,
        images: images,
        color_variant_name: 'Blue',
        is_new: true,
        active: true,
        display_new: true,
        slug: 'product-1',
        modified_on: currentDate,
        created_on: currentDate
      })
    })

    instance.create('products', mockupProducts.value)
  }

  function getProduct () {
    return mockupProducts.value[0]
  }

  function getRandomProduct () {
    const randomIndex = Math.floor(Math.random() * mockupProducts.value.length) + 1
    return mockupProducts.value[randomIndex]
  }

  onBeforeMount(() => {
    generateProducts(maxProducts.value)
  })
  
  return {
    mockupProducts,
    mockupProduct,
    getProduct,
    getRandomProduct
  }
}
