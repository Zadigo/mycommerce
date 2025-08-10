import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import Base from '~/components/modals/Base.vue'

describe.concurrent.skip('Modal Base', () => {
  it('should mount correctly', async () => {
    const show = ref<boolean>(true)
    const component = await mountSuspended(Base, {
      props: {
        modelValue: show.value
      }
    })
    
    const modalEl = component.findComponent('TailSheet')
    expect(modalEl).not.toBeUndefined()
  })
})

