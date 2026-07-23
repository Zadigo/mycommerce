import type { ProductRecommendations } from '~/types'
import { createErrorTemplate } from '~/utils';

export default defineEventHandler(async (event) => {
  try {
    const { productName, quantity } = getQuery(event) as { productName: string; quantity: string }

    return await $fetch<ProductRecommendations>('/graphql/', {
      method: 'POST',
      body: {
        query: `
        query($name: String!, $quantity: Int!) {
          recommendations(productName: $name, quantity: $quantity) {
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
          }
        }
      `,
        variables: {
          name: productName,
          quantity: parseInt(quantity, 10)
        }
      }
    })
  } catch (error) {
    const template = createErrorTemplate(error)
    throw createError(template)
  }
})
