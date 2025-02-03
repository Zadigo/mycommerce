import { LoginAPIResponse } from '@/types'
import { useCookies } from '@vueuse/integrations/useCookies'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { type App } from 'vue'

function isSecure() {
    return window.location.href.startsWith('https://')
}

export function getDomain(altDomain?: string | null) {
    return import.meta.env.DEV ? '127.0.0.1' : altDomain || import.meta.env.VITE_BASE_DOMAIN
}

export function getBaseUrl(path: string, altDomain?: string | null, websocket: boolean = false, port: number = 8000) {
    let loc

    if (websocket) {
        loc = isSecure() ? 'wss' : 'ws'
    } else {
        loc = isSecure() ? 'https' : 'http'
    }

    const domain = getDomain(altDomain)
    console.info('getBaseUrl', `${loc}://${domain}:${port}${path}`)
    return `${loc}://${domain}:${port}${path}`
}

export default function createClient(path?: string, altDomain?: string, port?: 8000) {
    const basePath = path || '/api/v1/'
    const instance = axios.create({
        baseURL: getBaseUrl(basePath, altDomain, false, port),
        headers: { "Content-Type": 'application/json' },
        timeout: 10000,
        withCredentials: true
    })

    instance.interceptors.request.use(
        config => {
            const { get } = useCookies()
            const token = get('access')

            console.log('instance.interceptors.request.use', token)

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

                    const authClient = axios.create({
                        baseURL: getBaseUrl('/auth/v1/')
                    })

                    const response = await authClient.post<LoginAPIResponse>('/token/refresh/', {
                        refresh: refresh
                    })

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

export function useAxiosClient() {
    const client = createClient()
    
    // const response = ref<AxiosResponse>()
    // const isLoading = ref(false)

    // async function post(url: string, config: AxiosRequestConfig) {
    //     try {
    //         isLoading.value = true
    //         response.value = await client.post(url, config)
    //         isLoading.value = false
    //         return response
    //     } catch (e) {
    //         console.error(e)
    //         return null
    //     }
    // }

    // async function get(url: string, config: AxiosRequestConfig) {
    //     try {
    //         isLoading.value = true
    //         response.value = await client.get(url, config)
    //         isLoading.value = false
    //         return response
    //     } catch (e) {
    //         console.error(e)
    //         return null
    //     }
    // }

    return {
        // post,
        // get,
        client
    }
}

export function installAxiosClient(app: App) {
    const { client } = useAxiosClient()
    app.config.globalProperties.$client = client
}
