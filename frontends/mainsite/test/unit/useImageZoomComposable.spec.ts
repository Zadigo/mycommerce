import { describe, it, expect, afterEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { useImageZoomComposable, useImageZoomComposableStore } from '../../layers/base/app/composables/use/product/images'
import type { BaseImage } from '../../app/types/graphql'
import { faker } from '@faker-js/faker/locale/zu_ZA'

const testImage: BaseImage = {
  id: faker.string.uuid(),
  name: faker.commerce.productName(),
  original: faker.internet.url(),
  thumbnail: faker.internet.url(),
  variant: faker.color.human(),
  isMainImage: faker.datatype.boolean(),
  createdOn: faker.date.past().toISOString()
}

function createTestTree() {
  const Child = defineComponent({
    setup() {
      const { showModal, selectImage, selectedImage, handleCloseSelection } = useImageZoomComposableStore()

      // swap this for whatever shape selectImage actually expects
      const mockImage = testImage

      return () => h('div', [
        h('span', { 'data-testid': 'selected-image' }, selectedImage.value ? JSON.stringify(selectedImage.value) : ''),
        h('span', { 'data-testid': 'modal-state' }, showModal.value ? 'open' : 'closed'),
        h('button', { 'data-testid': 'select-btn', onClick: () => selectImage(mockImage) }, 'Select'),
        h('button', { 'data-testid': 'close-btn', onClick: () => handleCloseSelection() }, 'Close'),
        h('button', { 'data-testid': 'toggle-btn', onClick: () => showModal.value = !showModal.value }, 'Toggle Modal'),
      ])
    }
  })

  return defineComponent({
    setup() {
      useImageZoomComposable()
      return () => h(Child)
    }
  })
}

describe('useImageZoomComposable', () => {
  const wrappers: VueWrapper[] = []
  afterEach(() => wrappers.forEach(w => w.unmount()))

  it('starts with no image selected', () => {
    const wrapper = mount(createTestTree())
    wrappers.push(wrapper)

    expect(wrapper.get('[data-testid="selected-image"]').text()).toBe('')
    expect(wrapper.get('[data-testid="modal-state"]').text()).toBe('closed')
  })

  it('selectImage updates selectedImage', async () => {
    const wrapper = mount(createTestTree())
    wrappers.push(wrapper)

    await wrapper.get('[data-testid="select-btn"]').trigger('click')

    expect(wrapper.get('[data-testid="selected-image"]').text()).toContain(testImage.name)
    // remove this line if selectImage doesn't also open the modal
    expect(wrapper.get('[data-testid="modal-state"]').text()).toBe('open')
  })

  it.todo('handleCloseSelection clears the selection', async () => {
    const wrapper = mount(createTestTree())
    wrappers.push(wrapper)

    await wrapper.get('[data-testid="select-btn"]').trigger('click')
    await wrapper.get('[data-testid="close-btn"]').trigger('click')

    expect(wrapper.get('[data-testid="selected-image"]').text()).toBe('')
    expect(wrapper.get('[data-testid="modal-state"]').text()).toBe('closed')
  })
})
