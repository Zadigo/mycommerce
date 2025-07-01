import { renderSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'
import Confidentialite from '~/pages/confidentialite.vue'

describe.skip('Confidentialite Page', () => {
  it('should render correctly', async () => {
    const component = await renderSuspended(Confidentialite, {})
    const firstTitleEl = component.findByAltText('Utilisation des données personnelles')
    expect(firstTitleEl).not.toBeUndefined()
  })
})
