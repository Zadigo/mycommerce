import { describe, expect, it, vi } from 'vitest'
import Index from '../../app/pages/cart/index.vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import NavigationCardFooter from '../../app/components/cart/NavigationCardFooter.vue'

vi.mock('i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key
  })
}))

describe.todo('Cart Index Page', () => {
  it('should render correctly', async () => {
    const wrapper = await mountSuspended(Index, {
      global: {
        stubs: {
          NuxtLink: true
        }
      }
    })

    const footerEl = wrapper.findComponent(NavigationCardFooter)
    expect(footerEl.exists()).toBe(true)

    const titleEl = wrapper.find('h2')
    expect(titleEl.exists()).toBe(true)
    
    console.log(wrapper.html())
  })
})
