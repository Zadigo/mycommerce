import type { ProductFilters } from '~~/shared/types/filters'

export default defineEventHandler(async (_event) => {
  return {
    data: {
      productFilters: [
        {
          name: 'Size',
          values: [
            {
              name: 'XL'
            },
            {
              name: 'M'
            },
            {
              name: 'XXL'
            }
          ]
        },
        {
          name: 'Material',
          values: [
            {
              name: 'Coton'
            },
            {
              name: 'Polyester'
            },
            {
              name: 'Laine'
            }
          ]
        }
      ]
    }
  } as ProductFilters
})
