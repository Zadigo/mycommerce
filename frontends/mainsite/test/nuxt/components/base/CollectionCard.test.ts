import { describe, expect, it, vi } from 'vitest'
import type { TestCases } from '../../../setup'
import { faker } from '@faker-js/faker'
import { getCollection  } from '../../../__fixtures__'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import CollectionCard from '~/components/base/collection/Card.vue'

vi.mock('~/components/base/collection/CardContent.vue', () => ({
  default: defineComponent({
    template: '<div data-testid="card-content">Card Content</div>'
  })
}))

describe('base > collection card', () => {
  const testCases: TestCases = {
    cases: [
      {
        title: 'all props',
        props: {
          customName: 'custom-class',
          viewName: 'view-class',
          collection: getCollection(),
          image: faker.image.url(),
        }
      },
      {
        title: 'no props',
        props: {
          customName: undefined,
          viewName: undefined,
          collection: undefined,
          image: undefined,
        }
      }
    ]
  }

  testCases.cases.forEach((testCase) => {
    it.todo(`should render correctly with ${testCase.title}`, async () => {
      const component = await mountSuspended(CollectionCard, {
        props: testCase.props
      })

      expect(component.find('[data-testid="card-content"]').exists()).toBe(true)
      expect(component.find('[data-testid="card-content"]').attributes('image')).toBe(testCase.props.image)
    })
  })
})
