import { $fetch, setup } from '@nuxt/test-utils'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'


import ErrorPage from '~/pages/404.vue'

describe('404Page', () => {
    setup({
        // Mock any specific Nuxt configuration if needed
        nuxtConfig: {
            ssr: true,
        },
    })

    it('should render', async () => {
        const { getByText } = render(ErrorPage)
        expect(getByText('404')).toBeTruthy()
    })

    it.todo('should return a 404 response code', async () => {
        const response = await $fetch('/non-existing-page', { method: "GET" })
        expect(response.status).toBe(404)
    })
})
