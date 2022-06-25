import axios from 'axios'
import i18n from '@/i18n'
import { useAuthentication } from '../store/authentication'

axios.defaults.headers.common['Accept-Language'] = `${i18n.global.locale},en-US;q=0.9,en-GB;q=0.9`
axios.defaults.headers.common['Content-Type'] = 'application/json'

const client = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1',
  timeout: 10000,
  withCredentials: true
})

client.interceptors.request.use(
  request => {
    const store = useAuthentication()
    if (store.token) {
      request.headers.Authorization = `Token ${store.token}`
    }
    return request
  }
)

function createAxios () {
  return {
    install: (app) => {
      app.config.globalProperties.$http = client
    }
  }
}

export {
  client,
  createAxios
}
