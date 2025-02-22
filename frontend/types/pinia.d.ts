import 'pinia'
import type { ComputedRef, Ref } from 'vue'
import type { Profile, SessionCacheData } from '~/types'

// General properties for all stores
declare module 'pinia' {
    export interface PiniaCustomProperties {
        sessionCache: Ref<SessionCacheData>
    }
    export interface PiniaCustomStateProperties {
        sessionCache: SessionCacheData
    }
}

declare module 'pinia' {
    export interface PiniaCustomProperties {
        profile?: ComputedRef<Profile>
    }
}

// Specific properties for the authentication store
// declare module 'pinia' {
//     export interface PiniaCustomStateProperties<S> {
//         profile: S extends { $id: 'authentication' } ? ComputedRef<Profile> : null
//     }

//     export interface PiniaCustomProperties<S> {
//         profile: S extends { $id: 'authentication' } ? Ref<Profile> : null
//     }
// }

// export interface AuthenticationStore {
//     profile: Ref<Profile | null>
//     $state: {
//         profile: ComputedRef<Profile | null>
//     }
// }
