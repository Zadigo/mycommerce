import type { AxiosInstance } from 'axios'
import axios from 'axios'

export default defineNuxtPlugin((nuxtApp) => {
    const client: AxiosInstance = axios.create({
        baseURL: process.env.BASE_URL,
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
