import axios from 'axios'
import type { App } from 'vue'


function isSecure() {
    return import.meta.env.DEV === false
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
        error => {
            return Promise.reject(error)
        }
    )

    return instance
}

// const client = createClient()

export function useAxiosClient() {
    const client = createClient()

    return {
        client
    }
}

export function installAxiosClient(app: App) {
    const { client } = useAxiosClient()
    app.config.globalProperties.$client = client
}
