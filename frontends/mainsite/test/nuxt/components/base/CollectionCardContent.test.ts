import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'
import BaseCardContent from '~/components/base/collection/CardContent.vue'
import type { TestCases } from '../../../setup'
import { faker } from '@faker-js/faker'

describe('base > collection card content', () => {
  const testCases: TestCases = {
    cases: [
      {
        title: 'with all props',
        props: {
          collectionName: 'Test Collection',
          category: 'Test Category',
          image: faker.image.url(),
          urlId: 'test-collection',
        }
      },
      // {
      //   title: 'with undefined props',
      //   props: {
      //     collectionName: undefined,
      //     category: undefined,
      //     image: undefined,
      //     urlId: undefined,
      //   }
      // }
    ]
  }

  testCases.cases.forEach((testCase) => {
    it(`should render correctly with ${testCase.title}`, async () => {
      const component = await mountSuspended(BaseCardContent, {
        props: testCase.props
      })
      
      const linkEl = component.get('a')
      
      expect(linkEl.attributes('href')).toBeDefined()
      expect(linkEl.text()).toBeDefined()

      const src = linkEl.attributes('href')
      expect(src?.includes('test-collection')).toBe(true)

      const imgEl = component.find('img')
      expect(imgEl.attributes('src')).toBeDefined()
      expect(imgEl.attributes('alt')).toBeDefined()
      
      expect(component.find('h1').text()).toBeDefined()
    })
  })
})
