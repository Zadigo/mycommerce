import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import CollectionsPage from '../src/pages/CollectionsPage.vue'

describe('CollectionsPage', () => {
    it('should render', () => {
        const wrapper = mount(CollectionsPage)

        expect(wrapper.find('h1').exists()).toBeTruthy()
    })

    it('should do something', () => {
        
    })
})
