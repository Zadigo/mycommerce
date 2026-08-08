import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import Info from '~/components/product/page/aside/Info.vue'
import { getProduct } from '~~/test/__fixtures__'
import type { ProductNode } from '~/types'

describe('component > page > aside > info', () => {
  it('should have h1 title', async () => {
    const component = await mountSuspended(Info, {
      props: {
        product: getProduct()
      }
    })
    expect(component.find('h1').exists()).toBe(true)
    expect(component.find('h1').text()).toBe(getProduct().node.name)
  })

  const testCases: { title: string, product: ProductNode }[] = [
    {
      title: 'sale price with product on sale',
      product: {
        node: {
          ...getProduct().node,
          onSale: true,
          salePrice: 10.99,
          unitPrice: 10.99,
          price: 19.99
        }
      }
    },
    {
      title : 'sale price with product not on sale',
      product: {
        node: {
          ...getProduct().node,
          onSale: false,
          salePrice: 0,
          unitPrice: 19.99,
          price: 19.99
        }
      }
    }
  ]

  testCases.forEach((product) => {
    it(`should render elements for price when ${product.title}`, async () => {
      const component = await mountSuspended(Info, {
        props: {
          product: product.product
        }
      })
      
      if (product.product.node.onSale) {
        expect(component.find('span.text-red-400').exists()).toBe(true)
        expect(component.find('span.text-black').exists()).toBe(true)
        expect(component.find('p[id^="product-price-"]').exists()).toBe(false)
      } else {
        expect(component.find('p[id^="product-price-"]').exists()).toBe(true)
      }
    })
  })
})
