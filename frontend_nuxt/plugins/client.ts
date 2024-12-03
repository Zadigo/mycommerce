/**
 * Nuxt Axios Plugin
 * 
 * This plugin integrates Axios into Nuxt templates, providing an HTTP client 
 * accessible globally within the Nuxt application via `$client`
 * 
 * Features:
 * - Configures a default Axios client with base headers, including `Authorization`.
 * - Adds request and response interceptors:
 *   - **Request Interceptor**: Attaches a `Token` header if an access token is found 
 *     in the cookies.
 *   - **Response Interceptor**: Passes successful responses or propagates errors.
 * 
 * Usage:
 * Inside Nuxt templates or composables, use the following pattern:
 * 
 * ```typescript
 * const { $client } = useNuxtApp();
 * $client.get('/api/resource').then(response => {
 *     console.log(response.data);
 * });
 * ```
 * 
 * Notes:
 * - Ensure `useCookie` is configured correctly to retrieve the `access` cookie.
 * - The `createClient` function should be defined and configured for Axios
 *   in the `useAxiosClient` composable or utility.
 */
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
        (error) => {
            return Promise.reject(error);
        }
    )

    nuxtApp.provide('client', client)
})
