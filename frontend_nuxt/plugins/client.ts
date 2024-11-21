import type { AxiosInstance } from 'axios'
import axios from 'axios'

export function getBaseUrl(secure = false, port = '8000') {
    let domain = `127.0.0.1:${port}`

    if (process.env.DEV === 'production') {
        domain = process.env.DJANGO_PROD_URL
    }

    const loc = secure ? 'https://' : 'http://'
    const bits = [loc, domain, 'api/v1/']
    const url = bits.join('')
    
    return new URL(url).toString()
}

export default defineNuxtPlugin((nuxtApp) => {
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

    nuxtApp.provide('client', client)
})
