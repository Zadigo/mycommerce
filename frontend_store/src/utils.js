function createMockupProducts (s = 30) {
  const products = Array.from({ length: s }, (k, v) => ({
    id: v + 1,
    name: `Soutien-gorge corbeille ${v + 1}`,
    description: 'Discover how to use Schema.org',
    sizes: [ 'XS', 'S', 'M' ],
    variants: [1, 2],
    get_main_image: '/assets/img8.jpeg',
    slug: `soutien-gorge-corbeille-${ v + 1}`,
    price: 45.93
  }))
  return products
//   setTimeout(() => {
//     return products
//   }, 200)
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
  createMockupProduct,
  createMockupProducts
}
