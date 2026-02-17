export const baseProductGraph = `
  id
  name
  slug
  price
  salePrice
  unitPrice
  displayNew
  mainImage {
    id
    name
    original
    thumbnail
    isMainImage
    variant
    createdOn
  }
  productImages {
    id
    name
    original
    thumbnail
  }
`
