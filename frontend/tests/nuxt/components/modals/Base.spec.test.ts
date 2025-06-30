import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it } from 'vitest'
import Base from '../../../../components/modals/Base.vue'

describe('Base Modal', () => {
  it('should mount correctly', async () => {
    const show = ref<boolean>(true)
    const component = await mountSuspended(Base, {
      props: {
        modelValue: show.value
      }
    })
  })
})
