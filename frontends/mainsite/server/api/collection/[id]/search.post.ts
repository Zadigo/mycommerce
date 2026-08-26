import type { SearchCollection } from '~~/shared/types/collection'
import { faker } from '@faker-js/faker'

export default defineEventHandler(async (event) => {
  const searchParams = await readBody(event) as { sizes?: string, materials?: string }
  return {
    data: {
      searchCollection: {
        edges: [
          {
            node: {
              id: faker.number.int({ min: 1, max: 1000 }).toString(),
              reference: `prod-${faker.string.uuid()}`,
              name: faker.commerce.productName()
            }
          },
          {
            node: {
              id: faker.number.int({ min: 1, max: 1000 }).toString(),
              reference: `prod-${faker.string.uuid()}`,
              name: faker.commerce.productName()
            }
          },
          {
            node: {
              id: faker.number.int({ min: 1, max: 1000 }).toString(),
              reference: `prod-${faker.string.uuid()}`,
              name: faker.commerce.productName()
            }
          }
        ]
      }
    }
  } as SearchCollection
})
