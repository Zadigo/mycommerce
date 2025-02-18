import { useCookies } from '@vueuse/integrations/useCookies'
import { AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import axios from 'axios'
import { ref } from 'vue'
import { inProduction } from '~/utils'

export interface LoginApiResponse {
    access: string
    refresh: string
}

/**
 * Function that returns the root domain to use for the client. The string
 * will a development domain if DEV is true or an alternative (production) domain
 * when the application is in a production environment
 * 
 * @param altDomain Production domain
 *  
 */
export function getDomain(altDomain?: string | null): string {
    if (inProduction()) {
        // Raise an error when both alt-domain and the
        // base domain to use are not set
        const result = altDomain || useRuntimeConfig().public.djangoProdUrl

        if (!result) {
            throw createError('VITE_BASE_DOMAIN or altDomain needs to be specified')
        }

        return result
    } else {
        return '127.0.0.1'
    }
}

/**
 * Helper function that returns the correct url to be used for Axios
 * 
 * @param altDomain The production domain to be used
 * @param [port=8000] Used for local development purposes 
 */
export function getBaseUrl(path: string, altDomain?: string | null, websocket: boolean = false, port: number = 8000) {
    let loc = websocket ? 'ws' : 'http'
    let url: URL

    const domain = getDomain(altDomain)

    if (inProduction()) {
        loc += 's'
    }

    if (domain && inProduction()) {
        url = new URL(path, `${loc}://${domain}`)
    } else {
        url = new URL(path, `${loc}://${domain}:${port}`)
    }

    return url.toString()
}

/**
 * Creates a client and adds no authentication interceptors
 * 
 * @param [port=8000] Used for local development purposes
 */
export function createAxiosSimpleClient(path?: string | null, altDomain?: string | null, websocket: boolean = false, port = 8000) {
    if (path) {
        return axios.create({
            baseURL: getBaseUrl(path, altDomain, websocket, port),
            headers: { "Content-Type": 'application/json' },
            timeout: 10000,
            withCredentials: true
        })
    } else {
        throw Error('Path should not be empty')
    }
}

/**
 * Creates a client and adds authentication interceptors 
 * in order to account for authenticated requests on Django
 */
export default function createDjangoClient(path?: string | null, altDomain?: string | null, websocket: boolean = false, port = 8000) {
    const instance = createAxiosSimpleClient(path, altDomain, websocket, port)

    instance.interceptors.request.use(
        config => {
            const { get } = useCookies()
            const token = get('access')


            if (token) {
                config.headers.Authorization = `Token ${token}`
            }
            return config
        },
        error => {
            return Promise.reject(error)
        }
    )

    instance.interceptors.response.use(
        response => {
            return response
        },
        async (error) => {
            // Sequence that refreshes the access token when
            // we get a 401 code trying to access a page

            const originalRequest = error.config

            if (error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true

                try {
                    const { get, set } = useCookies()
                    const refresh = get('refresh')

                    // set('access', null)

                    const authClient = axios.create({
                        baseURL: getBaseUrl('/auth/v1/')
                    })

                    const response = await authClient.post<LoginApiResponse>('/token/refresh/', { refresh })

                    set('access', response.data.access)
                    return authClient
                } catch (refreshError) {
                    return Promise.reject(refreshError)
                }
            }

            return Promise.reject(error)
        }
    )

    return instance
}

/**
 * Composable that creates a client and adds authentication interceptors in
 * order to be able to send requests to a Django backend
 * 
 * @param path The endpoint path. Defaults to `/api/v1/`
 * @param [port=8000] Used for local development purposes
 * @param altDomain Production domain to be used. Temporarily overrides the VITE_BASE_DOMAIN
 */
export function useAxiosClient(path?: string, altDomain?: string | null, websocket: boolean = false, port: number = 8000) {
    const cleanPath = path || '/api/v1/'
    const client = createAxiosSimpleClient(cleanPath, altDomain, websocket, port)

    const isLoading = ref(false)
    const clientResponse = ref<AxiosResponse>()

    async function run<T>(
        action: 'get' | 'post' | 'patch' | 'put' | 'delete',
        data?: AxiosRequestConfig,
        callback?: (data: T) => void,
        errorCallback?: (err: AxiosError<T>) => void
    ) {
        try {
            isLoading.value = true

            switch (action) {
                case 'get':
                    clientResponse.value = await client.get(cleanPath, data)
                    break;

                case 'post':
                    clientResponse.value = await client.post(cleanPath, data)
                    break;

                case 'patch':
                    clientResponse.value = await client.patch(cleanPath, data)
                    break;

                case 'put':
                    clientResponse.value = await client.put(cleanPath, data)
                    break;

                case 'delete':
                    clientResponse.value = await client.delete(cleanPath, data)
                    break;

                default:
                    break;
            }

            isLoading.value = false

            if (callback) {
                if (clientResponse.value) {
                    callback(clientResponse.value.data)
                }
            }
        } catch (e) {
            isLoading.value = false
            if (errorCallback && e instanceof AxiosError) {
                errorCallback(e)
            }
        }
    }

    return {
        run,
        clientResponse,
        isLoading,
        client
    }
}
