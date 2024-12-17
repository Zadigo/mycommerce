import { config, mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import ErrorPage from '~/pages/404.vue'

config.global.mocks = {
    $t: (message: string) => message
}

describe('404 Page', () => {
    // setup({
    //     nuxtConfig: {
    //         ssr: true,
    //     },
    // })

    it('can render', async () => {
        const wrapper = mount(ErrorPage, {
            global: {
                stubs: {
                    NuxtLink: true
                }
            }
        })

        expect(wrapper.exists()).toBe(true)
        expect(wrapper.find('h1').text()).toEqual('404')
    })

    it.todo('should return a 404 response code', async () => {
        const response = await $fetch('/non-existing-page', { method: "GET" })
        expect(response.status).toBe(404)
    })
})
