import { IteratorsTextBlock } from '#components'
import { mountSuspended, renderSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'

import Guide from '~/pages/guide.vue'

describe.skip('Guide Page', () => {
  it('should render page', async () => {
    const el = await renderSuspended(Guide, {})
    const firstTitleEl = await el.findByText('Comment retourner un article ?')
    expect(firstTitleEl).toBeDefined()
  })

  it('should have iterator text block', async () => {
    const component = await mountSuspended(Guide)
    const iterator = component.getComponent(IteratorsTextBlock)
    
    expect(iterator).toBeDefined()
    expect(iterator.isVisible()).toBeTruthy()
  })
}, 10000)
