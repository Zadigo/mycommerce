import { it, expect, describe } from 'vitest'
import { fileURLToPath } from 'node:url'
import { setup, $fetch } from '@nuxt/test-utils'

await setup({
  rootDir: fileURLToPath(new URL('../../', import.meta.url)),
  setupTimeout: 60000
})

describe('Conditions Generales', () => {
  it('can fetch the page conditions generales', async() => {
    const html = await $fetch<string>('/conditions-generales')
    expect(html).toContain('Conditions')
  })
})
