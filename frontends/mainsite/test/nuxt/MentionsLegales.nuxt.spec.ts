import { describe, expect, it } from 'vitest'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import MentionsLegales from '../../app/pages/mentions-legales.vue'

describe('MentionsLegales Page', () => {
  it('should render MentionsLegales page', async () => {
    const { getByText } = await renderSuspended(MentionsLegales)
    const el = getByText('Conditions')
    expect(el).toBeDefined()
  })
})
