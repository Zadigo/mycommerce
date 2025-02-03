import { setup, useNuxtApp } from '@nuxt/test-utils';
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getBaseUrl } from "~/plugins/client";

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';


describe('test get base url', () => {
    it('should resolve to django development url', async () => {
        const url = getBaseUrl()

        expect(url).toEqual('http://127.0.0.1:8000/api/v1/')
    })

    it('should return the correct URL in production mode', () => {
        process.env.DEV = 'production'
        process.env.NUXT_DJANGO_PROD_URL = 'my-prod-domain.com'
        expect(getBaseUrl()).toBe('https://my-prod-domain.com/api/v1/')
    })

    it('should return a secure URL when secure is true', () => {
        process.env.NUXT_DJANGO_PROD_URL = '127.0.0.1:8000'
        expect(getBaseUrl(true)).toBe('https://127.0.0.1:8000/api/v1/')
    })
})

describe('Axios Plugin', () => {
    let mock: MockAdapter
    let client: ReturnType<typeof axios.create>

    beforeEach(async () => {
        await setup({
            nuxtConfig: {
                modules: [],
                // Mock your environment variables for the test
                runtimeConfig: {
                    public: {
                        DEV: 'development',
                    },
                },
            },
        })

        const { $client } = useNuxtApp()
        mock = new MockAdapter($client)
    })

    afterEach(() => {
        mock.restore()
    })

    it('should set the correct baseURL', async () => {
        expect(client.defaults.baseURL).toBe('http://127.0.0.1:8000/api/v1/')
    })
})
