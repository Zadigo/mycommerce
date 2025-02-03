import type { AxiosInstance } from 'axios'
import type { LoginAPIResponse } from "~/types"

export default defineNuxtPlugin((nuxtApp) => {
    const { createClient } = useAxiosClient()
    const client = createClient()

    client.interceptors.request.use(
        config => {
            const token = useCookie('access')

            if (token.value) {
                config.headers.Authorization = `Token ${token.value}`
            }
            return config
        },
        error => {
            return Promise.reject(error)
        }
    )

    client.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            // Sequence that refreshes the access token when
            // we get a 401 code trying to access a page

            const originalRequest = error.config
            const baseClient = nuxtApp.$client as AxiosInstance
            
            if (error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true
                
                try {
                    const access = useCookie('access')
                    const authStore = useAuthentication()
                    const authClient = createClient('/auth/v1/')
                    const response = await authClient.post<LoginAPIResponse>('/token/refresh/', {
                        refresh: authStore.refreshToken
                    })
                    originalRequest.headers.Authorization = `Token ${response.data.access}`
                    access.value = response.data.access
                    return baseClient(originalRequest)
                } catch (refreshError) {
                    // FIXME: If the refresh fails, remove the access
                    // and refresh from the cookie since these
                    // would attempt to send authenticated requests
                    // that would return a 401
                    return Promise.reject(refreshError)
                }
            }

            return Promise.reject(error);
        }
    )

    nuxtApp.provide('client', client)
})
