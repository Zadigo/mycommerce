import { useAuthentication } from "@/stores/authentication";
import { useMessages } from "@/stores/messages";
import { useCookies } from "@vueuse/integrations/useCookies";
import { VueSessionInstance } from "./vue-storages";

import axios from "axios";

/**
 * Returns the proper API url for calling
 * the backend depending on the application's
 * development state
 */
function getApiUrl() {
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

const authClient = axios.create({
  baseURL: "http://127.0.0.1:8000/auth/v1/",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 10000,
})

/**
 * Client -> Django
 */
const client = axios.create({
  baseURL: getApiUrl(),
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 10000,
});

client.interceptors.request.use((config) => {
  const store = useAuthentication();

  if (store.isAuthenticated) {
    // config.headers.Authorization = `Token ${store.token}`;
    config.headers.Authorization = `Token ${store.accessToken}`;
  }

  return config;
});

client.interceptors.response.use((response) => {
  if (response.status === 401) {
    const cookies = useCookies();
    const store = useAuthentication()

    VueSessionInstance.remove("authentication");
    VueSessionInstance.remove("profile");
    cookies.remove("token");
    store.logout()
  }

  if ([404, 500].includes(response.status)) {
    const messagesStore = useMessages();
    messagesStore.addNetworkError();
  }
  return response;
});

export { client, quartClient, authClient };

