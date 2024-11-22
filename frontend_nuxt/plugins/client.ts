export default defineNuxtPlugin((nuxtApp) => {
    const { createClient } = useAxiosClient()
    const client = createClient()

    client.interceptors.request.use(
        config => {
            const token = useCookie('access')
            console.log(token)
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
            return Promise.reject(error);
        }
    )

    nuxtApp.provide('client', client)
})
