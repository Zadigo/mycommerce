import { describe, it, expect, beforeEach } from 'vitest'
import { VueWrapper } from '@vue/test-utils'
import { useImageZoomComposable, useImageZoomComposableStore } from '../../layers/base/app/composables/use/product/images'
import type { BaseImage } from '../../app/types/graphql'
import { faker } from '@faker-js/faker/locale/zu_ZA'
import { mountSuspended } from '@nuxt/test-utils/runtime'

const testImage: BaseImage = {
  id: faker.string.uuid(),
  name: faker.commerce.productName(),
  original: faker.internet.url(),
  thumbnail: faker.internet.url(),
  variant: faker.color.human(),
  isMainImage: faker.datatype.boolean(),
  createdOn: faker.date.past().toISOString()
}

describe('useImageZoomComposable', () => {
  let component: VueWrapper<any>
  let store: ReturnType<typeof useImageZoomComposableStore> | undefined = undefined

  beforeEach(async () => {
    component = await mountSuspended(defineComponent({
      template: `
      <div>
        <span v-if="store.showModal">Show modal</span>
      </div>`,
      setup() {
        useImageZoomComposable()
        store = useImageZoomComposableStore()
        return {
          store
        }
      }
    }))
  })

  it('should initialize with default values', async () => {
    expect(store).toBeDefined()

    if (store) {
      expect(store.showModal.value).toBe(false)
      expect(store.selectedImage.value).toBeUndefined()
      expect(store.selectImage).toBeInstanceOf(Function)
    }
  })

  it('should select an image and open the modal', async () => {
    expect(store).toBeDefined()

    if (store) {
      store.selectImage(testImage)
      await component.vm.$nextTick()
  
      expect(store.showModal.value).toBe(true)
      expect(store.selectedImage.value).toEqual(testImage)
  
      const spanEl = component.find('span')
      expect(spanEl.exists()).toBe(true)
      expect(spanEl.text()).toBe('Show modal')
    }
  })
})
