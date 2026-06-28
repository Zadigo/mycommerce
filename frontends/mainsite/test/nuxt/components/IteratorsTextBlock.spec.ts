import IteratorsTextBlock from '~/components/iterators/text/Block.vue'
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { GuideText } from '~/types'

const blocks: GuideText[] = [
  {
    id: '1',
    title: 'text',
    text: [
      {
        id: '1',
        title: 'text',
        type: 'text',
        content: 'Some text content'
      }
    ]
  }
]

describe('IteratorsTextBlock', () => {
  blocks.forEach((block) => {
    it(`renders correctly with given ${block.id}`, async () => {
      const wrapper = await mountSuspended(IteratorsTextBlock, {
        props: {
          blocks
        }
      })
      console.log(wrapper.html())
      // expect(wrapper.html()).toMatchSnapshot()
    })
  })
})
