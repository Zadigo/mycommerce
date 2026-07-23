import IteratorsTextBlock from '../../../app/components/iterators/text/Block.vue'
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { GuideText } from '~/types'

type TestCase = {
  title: string
  blocks: GuideText[]
}

const testcases: TestCase[] = [
  {
    title: 'renders correctly with given paragraph type',
    blocks: [
      {
        id: '1',
        title: 'text',
        text: [
          {
            id: '1',
            title: 'My title',
            type: 'text',
            content: 'Some text content'
          }
        ]
      }
    ]
  },
  // {
  //   title: 'renders correctly with given list type',
  //   blocks: [
  //     {
  //       id: '1',
  //       title: 'list',
  //       text: [
  //         {
  //           id: '1',
  //           title: 'My title',
  //           type: 'points',
  //           content: [
  //             'Item 1',
  //             'Item 2',
  //             'Item 3'
  //           ]
  //         }
  //       ]
  //     }
  //   ]
  // }
]

describe('IteratorsTextBlock', () => {
  testcases.forEach((testcase) => {
    it(testcase.title, async () => {
      const wrapper = await mountSuspended(IteratorsTextBlock, {
        props: {
          blocks: testcase.blocks
        }
      })
      // console.log(wrapper.html())
      // expect(wrapper.html()).toMatchSnapshot()
      expect(wrapper.find('p').text()).toBe(testcase.blocks[0]?.text[0]?.content)
    })
  })
})
