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
            // Handle successful responses
            return response;
        },
        (error) => {
            return Promise.reject(error);
        }
    )

    nuxtApp.provide('client', client)
})
