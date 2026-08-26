import { describe, it, expect, beforeEach } from 'vitest'
import ProductCardCarousel from '../../../../app/components/product/card/Carousel.vue'
import type { BaseImage, ProductNode } from '../../../../app/types/index.js'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { productFixture } from '../../../../layers/base/app/utils/__fixtures__/index.js'


type Testcase = {
  title: string,
  images: BaseImage[]
  props: {
    index: number
    product: ProductNode,
    isHovered: boolean,
    showCarousel: boolean
  }
}

// The image object does not show
describe.todo('ProductCardCarousel', () => {
  const testcases: Testcase[] = [
    {
      title: 'should render correctly with images',
      images: [
       {
          id: '1',
          name: 'Image 1',
          original: 'https://example.com/image1.jpg',
          thumbnail: 'https://example.com/image1_thumb.jpg',
          variant: 'default',
          isMainImage: true,
          createdOn: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          name: 'Image 2',
          original: 'https://example.com/image2.jpg',
          thumbnail: 'https://example.com/image2_thumb.jpg',
          variant: 'default',
          isMainImage: false,
          createdOn: '2024-01-02T00:00:00Z'
        }
      ],
      props: {
        index: 1,
        product: productFixture,
        isHovered: false,
        showCarousel: true
      }
    }
  ]

  beforeEach(() => {
    testcases.forEach((testcase) => {
      testcase.props.product.node.productImages = testcase.images
    })
  })

  testcases.forEach((testcase) => {
    it(testcase.title, async () => {
      const wrapper = await mountSuspended(ProductCardCarousel, {
        props: testcase.props
      })

      expect(wrapper).toBeDefined()

      // console.log(wrapper.html())

      // Link
      const linkEl = wrapper.find('[id^="link-product-carousel"]')
      expect(linkEl.exists()).toBe(true)
      expect(linkEl.attributes('href')).toBeDefined()
      expect(linkEl.attributes('disabled')).toBeUndefined()

      // Image
      const imgEl = wrapper.find('img')
      expect(imgEl.exists()).toBe(true)
      expect(imgEl.attributes('src')).toBeDefined()
      expect(imgEl.attributes('alt')).toBeDefined()
    })
  })
})
