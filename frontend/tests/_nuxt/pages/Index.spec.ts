import { useCookie } from '#imports'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { testCollection } from '~/data/__fixtures__/collections'

import BaseCollectionCard from '~/components/BaseCollectionCard.vue'
import Index from '~/pages/index.vue'

vi.mock('#app', () => ({
  useFetch: vi.fn(() => ({
    data: { value: testCollection },
    status: 'success',
    error: null,
    pending: false,
  }))
}))

describe.skip('Index Page', () => {
  beforeEach(() => {
    const cookieMock = { value: 'initial-token' }

    (useCookie as any).mockImplementation((name: string) => {
      return cookieMock
    })
  })

  afterAll(() => {
    vi.resetAllMocks()
  })

  it('should have a default collection card', async () => {
    const component = await mountSuspended(Index)
    console.log(component)
    const collectionEl = component.getComponent(BaseCollectionCard)    
  })

  it('should have three articles', async () => {
    const component = await mountSuspended(Index)
    const articles = component.findAll('article')
    expect(articles.length).toBe(3)
  })
  
  it('articles should be clickeable links', async () => {
    const component = await mountSuspended(Index)
    const articles = component.findAll(`[id="link-collection-card"]`)
    articles.forEach(article => {
      expect(article.element.getAttribute('href')).not.toBeNull()
    })
  })
}, 50000)
