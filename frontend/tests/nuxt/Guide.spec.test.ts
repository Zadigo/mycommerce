import { renderSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'
import Guide from '../../pages/guide.vue'

describe('Guide Page', () => {
  it('should render correctly', async () => {
    const el = await renderSuspended(Guide, {})
    const firstTitleEl = el.findByText('Comment retourner un article ?')
    expect(firstTitleEl).not.toBeUndefined()
  })
})
