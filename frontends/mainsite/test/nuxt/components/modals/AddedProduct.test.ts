import { describe, it, expect, vi } from 'vitest'
import AddedProductModal from '~/components/modals/AddedProduct.vue'
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime'
import { getCartItem } from '~~/test/__fixtures__'

vi.mock('~/components/base/Recommendations.vue', () => ({
  default: defineComponent({
    template: '<div data-testid="recommendations" />'
  })
}))


const { useState, useCartComposable, useUser } = vi.hoisted(() => {
  const useState = vi.fn((_key: string) => ref(true))
  const useCartComposable = vi.fn().mockReturnValue(() => ({
    cart: getCartItem(),
    lastProduct: getCartItem()
  }))
  const useUser = vi.fn().mockReturnValue(() => ({
    isAuthenticated: ref(false)
  }))

  return {
    useState,
    useCartComposable,
    useUser
  }
}) 

mockNuxtImport('useState', () =>  useState)

mockNuxtImport('useLocalePath', () => vi.fn((value: string) => value))

mockNuxtImport('useUser', () => useUser)

vi.mock('~~/layers/base/app/composables/use/cart', async (original) => {
  const actual = await original<typeof import('~~/layers/base/app/composables/use/cart')>()
  return {
    ...actual,
    useCartComposable: useCartComposable
  }
})

describe('components > modals > added product', () => {
  const testCases = [
    {
      title: 'render when defined',
      isVisible: true
    },
    {
      title: 'render when undefined',
      isVisible: false
    }
  ]

  testCases.forEach(({ title, isVisible }) => {
    it(`should render modal when ${title}`, async () => {
      const showAddedProductDrawer = ref(isVisible)
      useState.mockReturnValueOnce(showAddedProductDrawer)

      const component = await mountSuspended(AddedProductModal, {
        props: {
          visible: isVisible
        },
        global: {
          mocks: {
            $t: vi.fn((key: string) => key)
          }
        }
      })
      console.log(component.html())
    })
  })
})
