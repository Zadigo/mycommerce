// import _ from "lodash"

function buildImagePath (path, mediaPrefix = false, local = false) {
  let url

  if (path === null || typeof path === 'undefined') {
    const image = new URL(`./assets/placeholder.svg`, import.meta.url)
    return image.toString()
  }

  if (local) {
    const image = new URL(`./assets/${path}`, import.meta.url)
    return image.toString()
  }

  if (import.meta.env.DEV) {
    url = import.meta.env.VITE_DEVELOPMENT_URL
  } else {
    url = import.meta.env.VITE_PRODUCTION_URL
  }

  if (mediaPrefix) {
    url += '/media/'
  }

  
  const finalUrl = new URL(path, url)
  return finalUrl.toString()
}

function createMockupProducts (s = 30) {
  // const image = new URL('./assets/placeholder.svg', import.meta.url).href
  const image = buildImagePath('placeholder.svg', false, true)

  const products = Array.from({ length: s }, (k, v) => ({
    id: v + 1,
    name: `Soutien-gorge corbeille ${v + 1}`,
    color: 'White',
    category: 'A-line',
    description: 'Discover how to use Schema.org',
    images: [
      {
        id: 1429,
        name: "Jupe Cargo",
        product_set: [
          {
            id: 1105,
            name: "Jupe Cargo LanièRes"
          }
        ],
        original: image,
        thumbnail: image,
        mid_size: image
      }
    ],
    // sizes: [ 'XS', 'S', 'M' ],
    sizes: [
      {
        id: 1,
        name: 'XS',
        sub_category: 'Clothe size',
        availability: true,
      },
      {
        id: 2,
        name: 'S',
        sub_category: 'Clothe size',
        availability: true,
      },
      {
        id: 3,
        name: 'M',
        sub_category: 'Clothe size',
        availability: false,
      }
    ],
    variants: [1, 2],
    get_main_image: {
      id: 1430,
      name: "Jupe Cargo 2",
      product_set: [
        {
          id: 1105,
          name: "Jupe Cargo LanièRes"
        }
      ],
      original: image,
      thumbnail: image,
      mid_size: image
    },
    slug: `soutien-gorge-corbeille-${ v + 1}`,
    get_price: 45.93,
    price: 45.93,
    active: true
  }))
  return products
}

function createMockupProduct (id = null, s = 30) {
  const products = createMockupProducts(s)
  if (id) {
    return products[id * 1 + 1]
  } else {
    const randomIndex = Math.floor(Math.random() * s) + 1
    return products[randomIndex]
  }
}

export {
  buildImagePath,
  createMockupProduct,
  createMockupProducts
}
