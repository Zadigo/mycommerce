import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { testCollection } from '~/data/__fixtures__/collections'

import BaseCollectionCard from '~/components/BaseCollectionCard.vue'

describe.concurrent('template test', () => {
  const props = [
    { viewName: 'Test Name'},
    { collection: testCollection[0] }
  ]

  props.forEach(prop => {
    it(`should run correctly with ${prop}`, async () => {
      const component  = await mountSuspended(BaseCollectionCard, {
        props: { ...prop }
      })
      const title = component.find('h1')
      expect(title.exists()).toBeTruthy()
    })
  })
})
