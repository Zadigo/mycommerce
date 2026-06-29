import { afterEach, describe, expect, it, vi } from 'vitest'
import { useSimpleComposable } from '../../app/composables/quick'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Index from '../../app/pages/index.vue'

// vi.mock('@vueuse/core', async (importActual) => {
//   const actual = await importActual<typeof import('@vueuse/core')>()
//   return {
//     ...actual,
//     useLocalStorage: vi.fn().mockReturnValue('Sweet')
//   }
// })

describe('QuickTests', () => {
  it('should run a quick test', async () => {
    const wrapper = await mountSuspended(Index)
    const buttonEl = wrapper.find('button')
    
    expect(buttonEl).toBeDefined()
    void buttonEl.trigger('click')
    expect(wrapper.html()).toContain('1')
    
    console.log(wrapper.html())
  })
})
