import { describe, expect, it } from 'vitest'
import { renderSuspended, mountSuspended } from '@nuxt/test-utils/runtime'
import Index from '../../pages/index.vue'

describe('Index Page', () => {
  it('should render correctly', async () => {
    const component = await renderSuspended(Index, {})
    const collectionEl = component.getByText('All')
    expect(collectionEl).not.toBeUndefined()
  })
})
