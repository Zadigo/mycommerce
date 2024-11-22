import type { AxiosInstance } from 'axios'
import axios from 'axios'

/**
 * A helper function that creates and retuns 
 * the base url to use for Axios
 */
export function getBaseUrl(secure = false, port = '8000') {
    let domain = `127.0.0.1:${port}`

    if (process.env.DEV === 'production') {
        domain = process.env.NUXT_DJANGO_PROD_URL || ''
    }

    const loc = secure || process.env.DEV === 'production' ? 'https://' : 'http://'
    const bits = [loc, domain]
    const url = bits.join('')
    
    return new URL('/api/v1/', url).toString()
}

export function createClient(): AxiosInstance {
    const client: AxiosInstance = axios.create({
        baseURL: getBaseUrl(),
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
        timeout: 5000
    })

    client.interceptors.request.use(
        config => {
            const token = useCookie('access')
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
            return config
        },
        error => {
            return Promise.reject(error)
        }
    )

    client.interceptors.response.use(
        (response) => {
            // Handle successful responses
            return response;
        },
        (error) => {
            // Handle errors globally
            console.error('Axios Error:', error);
            return Promise.reject(error);
        }
    )
    
    return client
}

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.provide('client', createClient())
})
