import { describe, expect, it, beforeAll, afterAll, vi } from 'vitest'
import Index from '../../../app/pages/index.vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'


describe('Index Page', () => {
  beforeAll(async () => {
    vi.stubEnv('MODE', 'test')
  })

  afterAll(() => {
    vi.unstubAllEnvs()
  })

  it('should render correctly', async () => {
    const wrapper = await mountSuspended(Index)
    console.log(wrapper.html())

    // Title
    expect(wrapper.find('h1')).toBeDefined()

    // Section
    expect(wrapper.find('section')).toBeDefined()
    expect(wrapper.html()).toContain('id="collections"')

    // Image
    expect(wrapper.find('img')).toBeDefined()

    // Link
    expect(wrapper.find('a').exists()).toBe(true)
    expect(wrapper.find('a').attributes('href')).toBe('/shop/collection/all')
    expect(wrapper.find('a').attributes('disabled')).toBeUndefined()
  })
})
