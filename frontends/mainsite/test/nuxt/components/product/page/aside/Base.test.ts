import { mountSuspended, renderSuspended } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import Base from '~/components/product/page/aside/Base.vue'
import { getProduct } from '~~/test/__fixtures__'
import type { ProductNode, Undefineable } from '~/types'

vi.mock('~/components/product/page/aside/Actions.vue', () => ({
  default: defineComponent({
    template: `<div data-testid="Actions">{{ product.node.name }}</div>`,
    props: {
      product: {
        type: Object as PropType<Undefineable<ProductNode>>,
        default: undefined
      },
    }
  })
}))

const { useProductDetailsComposableStore } = vi.hoisted(() => {
  return {
    useProductDetailsComposableStore: vi.fn().mockReturnValue({
      hasColorVariants: false
    })
  }
})

vi.mock('~~/layers/base/app/composables/use/product', async (original) => {
  const actual = await original<typeof import('~~/layers/base/app/composables/use/product')>()
  return {
    ...actual,
    useProductDetailsComposableStore: useProductDetailsComposableStore
  }
})

describe('component > page > aside > base', () => {
  it('should have h1 title', async () => {
    const component = await mountSuspended(Base, {
      props: {
        product: getProduct()
      }
    })
    expect(component.find('h1').exists()).toBe(true)
    expect(component.find('h1').text()).toBe(getProduct().node.name)
  })
  
  const testCases = [
    getProduct(),
    undefined
  ]

  testCases.forEach((product) => {
    it.todo(`should match snapshot for ${typeof product === 'undefined' ? 'undefined' : 'defined'}`, async () => {
      const component = await mountSuspended(Base, {
        props: {
          product: product
        }
      })
      expect(component.html()).toMatchSnapshot()
    })
  })
  
  testCases.forEach((product) => {
    it(`should ${typeof product === 'undefined' ? 'not ' : ''}have product reference`, async () => {
      const component = await mountSuspended(Base, {
        props: {
          product
        }
      })

      if (typeof product === 'undefined') {
        expect(component.find('p#product-reference').exists()).toBe(false)
      } else {
        expect(component.find('p#product-reference').exists()).toBe(true)
      }
    })
  })

  describe('should render conditionally for color variants', () => {
    const colorVariantsTestCases: Record<string, boolean>[] = [
      {
        hasColorVariants: true,
        expected: true
      },
      {
        hasColorVariants: false,
        expected: false
      }
    ]

    colorVariantsTestCases.forEach(({ hasColorVariants, expected }) => {
      it(`should display color variants block when hasColorVariants is ${hasColorVariants}`, async () => {
        useProductDetailsComposableStore.mockReturnValueOnce({
          hasColorVariants: hasColorVariants
        })
  
        const component = await mountSuspended(Base, {
          props: {
            product: getProduct()
          }
        })
  
        expect(component.find('div#variants').exists()).toBe(expected)
      })
    })
  })

  it.skip('should have product price', async () => {
    const component = await mountSuspended(Base, {
      props: {
        product: getProduct()
      }
    })
    expect(component.find('p#product-price').exists()).toBe(true)
  })

  const otherCases = [
    {
      title: 'product composition',
      selectorText: 'Composition, soin et traçabilité',
      expectedEmit: 'composition-guide'
    },
    {
      title: 'return and delivery policy',
      selectorText: 'Livraison et retours',
      expectedEmit: 'delivery-guide'
    }
  ]

  otherCases.forEach(({ title, selectorText, expectedEmit }) => {
    it(`should have required "${selectorText}" in list group items for ${title}`, async () => {
      const component = await renderSuspended(Base, {
        props: {
          product: getProduct()
        }
      })

      const itemEl = await component.findByText(selectorText)
      expect(itemEl).toBeDefined()

      itemEl.click()

      const emitted = component.emitted()
      expect(emitted[expectedEmit]).toBeTruthy()
    })
  })
})
