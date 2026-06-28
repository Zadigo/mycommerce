import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { useImageComponentComposable } from '../../layers/base/app/composables/use/product'
import { productFixture } from '../../layers/base/app/utils/__fixtures__/products'
import { faker } from '@faker-js/faker/locale/zu_ZA'
import type { BaseImage } from '../../app/types/graphql/products'

type TestCase = {
  componentName: string
  numberOfImages: number
  expectedId: string
  images: BaseImage[]
}


describe('useImageComponentComposable', () => {
  it('should return NoImages component with 1 image', async () => {
    const { imagesComponent } = useImageComponentComposable(productFixture)

    expect(imagesComponent.value).toBeDefined()
    expect(imagesComponent.value.name).toBe('AsyncComponentWrapper')
    
    const { html } = await mountSuspended(imagesComponent.value)
    // One image should render NoImages component
    expect(html()).toContain('product-images-empty')
  })

  const testcases: TestCase[] = [
    {
      componentName: 'DefaultImage',
      numberOfImages: 3,
      expectedId: 'product-images-three',
      images: [
        {
          id: faker.number.int().toString(),
          createdOn: faker.date.past().toISOString(),
          isMainImage: true,
          name: 'main-image.jpg',
          original: '/images/main-image.jpg',
          thumbnail: '/images/main-image-thumb.jpg',
          variant: 'pink-something'
        },
        {
          id: faker.number.int().toString(),
          createdOn: faker.date.past().toISOString(),
          isMainImage: true,
          name: 'main-image.jpg',
          original: '/images/main-image.jpg',
          thumbnail: '/images/main-image-thumb.jpg',
          variant: 'pink-something'
        },
        {
          id: faker.number.int().toString(),
          createdOn: faker.date.past().toISOString(),
          isMainImage: true,
          name: 'main-image.jpg',
          original: '/images/main-image.jpg',
          thumbnail: '/images/main-image-thumb.jpg',
          variant: 'pink-something'
        }
      ]
    },
    {
      componentName: 'FiveImages',
      numberOfImages: 5,
      expectedId: 'product-images-five',
      images: [
        {
          id: faker.number.int().toString(),
          createdOn: faker.date.past().toISOString(),
          isMainImage: true,
          name: 'main-image.jpg',
          original: '/images/main-image.jpg',
          thumbnail: '/images/main-image-thumb.jpg',
          variant: 'pink-something'
        },
        {
          id: faker.number.int().toString(),
          createdOn: faker.date.past().toISOString(),
          isMainImage: true,
          name: 'main-image.jpg',
          original: '/images/main-image.jpg',
          thumbnail: '/images/main-image-thumb.jpg',
          variant: 'pink-something'
        },
        {
          id: faker.number.int().toString(),
          createdOn: faker.date.past().toISOString(),
          isMainImage: true,
          name: 'main-image.jpg',
          original: '/images/main-image.jpg',
          thumbnail: '/images/main-image-thumb.jpg',
          variant: 'pink-something'
        },
        {
          id: faker.number.int().toString(),
          createdOn: faker.date.past().toISOString(),
          isMainImage: true,
          name: 'main-image.jpg',
          original: '/images/main-image.jpg',
          thumbnail: '/images/main-image-thumb.jpg',
          variant: 'pink-something'
        },
        {
          id: faker.number.int().toString(),
          createdOn: faker.date.past().toISOString(),
          isMainImage: true,
          name: 'main-image.jpg',
          original: '/images/main-image.jpg',
          thumbnail: '/images/main-image-thumb.jpg',
          variant: 'pink-something'
        }
      ]
    },
    {
      componentName: 'SixImages',
      numberOfImages: 6,
      expectedId: 'product-images-six',
      images: [
        {
          id: faker.number.int().toString(),
          createdOn: faker.date.past().toISOString(),
          isMainImage: true,
          name: 'main-image.jpg',
          original: '/images/main-image.jpg',
          thumbnail: '/images/main-image-thumb.jpg',
          variant: 'pink-something'
        },
        {
          id: faker.number.int().toString(),
          createdOn: faker.date.past().toISOString(),
          isMainImage: true,
          name: 'main-image.jpg',
          original: '/images/main-image.jpg',
          thumbnail: '/images/main-image-thumb.jpg',
          variant: 'pink-something'
        },
        {
          id: faker.number.int().toString(),
          createdOn: faker.date.past().toISOString(),
          isMainImage: true,
          name: 'main-image.jpg',
          original: '/images/main-image.jpg',
          thumbnail: '/images/main-image-thumb.jpg',
          variant: 'pink-something'
        },
        {
          id: faker.number.int().toString(),
          createdOn: faker.date.past().toISOString(),
          isMainImage: true,
          name: 'main-image.jpg',
          original: '/images/main-image.jpg',
          thumbnail: '/images/main-image-thumb.jpg',
          variant: 'pink-something'
        },
        {
          id: faker.number.int().toString(),
          createdOn: faker.date.past().toISOString(),
          isMainImage: true,
          name: 'main-image.jpg',
          original: '/images/main-image.jpg',
          thumbnail: '/images/main-image-thumb.jpg',
          variant: 'pink-something'
        },
        {
          id: faker.number.int().toString(),
          createdOn: faker.date.past().toISOString(),
          isMainImage: true,
          name: 'main-image.jpg',
          original: '/images/main-image.jpg',
          thumbnail: '/images/main-image-thumb.jpg',
          variant: 'pink-something'
        }
      ]
    }
  ]
  
  testcases.forEach((testCase) => {
    it(`should return ${testCase.componentName} component with ${testCase.numberOfImages} images`, async () => {
      productFixture.node.productImages = testCase.images
      const { imagesComponent } = useImageComponentComposable(productFixture)
      expect(imagesComponent.value).toBeDefined()
      expect(imagesComponent.value.name).toBe('AsyncComponentWrapper')
      
      const { html, find, findAll } = await mountSuspended(imagesComponent.value, {
        props: {
          images: testCase.images
        }
      })
      expect(html()).toContain(testCase.expectedId)

      const imgEl = find('img')
      expect(imgEl.exists()).toBe(true)
      expect(imgEl.attributes('alt')).toBeDefined()
      expect(findAll('img').length).toBe(testCase.numberOfImages)
    })
  })
})
