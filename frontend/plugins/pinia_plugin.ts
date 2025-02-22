import { type PiniaPluginContext, type Pinia } from "pinia";
import { baseSessionCacheData } from "~/data";
import type { SessionCacheData } from "~/types";

// See: https://pinia.vuejs.org/core-concepts/plugins.html

export default defineNuxtPlugin(nuxtApp => {
    const pinia = nuxtApp.$pinia as Pinia
    
    const sessionCache = useSessionStorage<SessionCacheData>('cache', baseSessionCacheData, {
        serializer: {
            read(raw) {
                return JSON.parse(raw)
            },
            write(value) {
                return JSON.stringify(value)
            }
        }
    })
    
    function registerSessionCache({ store }: PiniaPluginContext) {
        // if (!store.$state.hasOwnProperty('sessionCache')) {
        //     // const cache = ref(baseSessionCacheData)
        // }
        
        store.$state.sessionCache = sessionCache
        store.sessionCache = toRef(store.$state, 'sessionCache')

        if (store.$id === 'authentication') {
            const profile = computed({
                get: () => sessionCache.value.profile,
                set: (value) => {
                    sessionCache.value.profile = value
                }
            })

            store.$state.profile = profile
        }

        store.$subscribe(() => {
            sessionCache.value = store.sessionCache
        })
    }

    pinia.use(registerSessionCache)
})
