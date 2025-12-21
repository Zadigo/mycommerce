import { renderSuspended } from '@nuxt/test-utils/runtime'
import { describe, it } from 'vitest'
import conditionsGenerales from '~/pages/conditions-generales.vue'

describe.skip('Conditions Générales Page', () => {
  it('should run correctly', async () => {
    const component = await renderSuspended(conditionsGenerales)
  })
})
