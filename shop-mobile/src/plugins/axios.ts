import { useAuthentication } from "@/stores/authentication";
import { AuthenticationAPIResponse } from "@/types";
import { useCookies } from "@vueuse/integrations/useCookies";
import axios from "axios";

/**
 *
 * Returns the proper API url for calling
 * the backend depending on the application's
 * development state
 *
 */
function getApiUrl(): string {
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_DEVELOPMENT_API_URL;
  } else {
    return import.meta.env.VITE_PRODUCTION_API_URL;
  }
}

/**
 * Client -> Quart/Flask
 */
const quartClient = axios.create({
  baseURL: "http://127.0.0.1:5000/api/v1/",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 10000,
});

/**
 * Client -> Django
 */
const client = axios.create({
  baseURL: getApiUrl(),
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 10000,
});

client.interceptors.request.use(
  (config) => {
    const store = useAuthentication();

    if (store.isAuthenticated) {
      config.headers.Authorization = `Token ${store.access}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error)
  }
);

client.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    // Sequence that refreshes the access token when
    // we get a 401 code trying to access a page

    const originalRequest = error.config

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const { get, set } = useCookies(['authentication'])
        const authStore = useAuthentication()
        const authClient = axios.create({
          baseURL: 'http://127.0.0.1:8000/auth/v1/'
        })
        const response = await authClient.post<AuthenticationAPIResponse>('/token/refresh/', {
          refresh: authStore.refresh || get('refresh')
        })

        originalRequest.headers.Authorization = `Token ${response.data.access}`
        set('access', response.data.access)
        return client(originalRequest)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
);

export { client, quartClient };

