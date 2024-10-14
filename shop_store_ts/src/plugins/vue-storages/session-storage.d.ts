/*eslint no-unused-vars: "off"*/
/*eslint no-use-before-define: "off"*/

import { App, Ref } from 'vue'
import { BaseStorage, BaseStorageOptions, SavedStorageData } from './base'

interface VueSessionOptions extends BaseStorageOptions {
    persistent?: boolean,
    afterMount?: (options: { instance: VueSession }) => void
}


declare class VueSession extends BaseStorage {
    isPersistent: boolean
    
    constructor(options?: VueSessionOptions)
    /** */
    protected _getValueForOperation(key: string): number
    /** */
    protected _getList<T>(key: string): T
    /** */
    b64Create(key: string, value: unknown): void
    /** */
    b64Retrieve(key: string): string
    /** */
    b64GetDelete(key: string): string
    /** */
    expire<T>(key: string, value: T, timeout?: number): void
    /** */
    persist(key: string): void
    /** */
    getOrExpire<T>(key: string): T | null
    /** */
    getType(key: string): string
    /** */
    renameKey(key: string, newKey: string): void
    /** */
    isEmpty(key: string): boolean
    /** */
    getDelete<T>(key: string): T
    /** */
    increment(key: string): void
    /** */
    decrement(key: string): void
    /** */
    incrementBy(key: string, k?: number): void
    /** */
    decrementBy(key: string, k?: number): void
    /** */
    incrementDictBy(key: string, keyToUpdate: string, k?: number): void
    /** */
    decrementDictBy(key: string, keyToUpdate: string, k?: number): void
    /** */
    getOrCreate<T>(key: string, value: unknown): T
    /** */
    listPush<T>(key: string, value: T): void
    /** */
    listPushUnique<T>(key: string, value: T, sort: boolean = false): void
    /** */
    defaultList<T>(key: string, value: T): void
    /** */
    listMerge<T extends string[] | number[] | object[]>(key: string, values: T): void
    /** */
    listCount(key: string, raiseError?: boolean): number
    /** */
    listContains(key: string): boolean
    /** */
    clearList (key: string): void
    /** */
    clearDict (key: string): void
    /** */
    toggle(key: string): void
    /** */
    dictSet(key: string, subKey: string, value: unknown): void
    /** */
    dictGet<T>(key: string, subKey: string): T
    /** */
    dictExists(key: string, subKey: string): boolean
    /** */
    dictClear(key: string): void
    /** */
    dictRemove<T>(key: string, subKey: string): T
    /** */
    contains(key: string): boolean
    /** */
    setup(app: App): void
}

export let VueSessionInstance: VueSession

declare global {
    interface Window {
        VueSession: VueSession
    }
}

declare function createVueSession(options?: VueSessionOptions): {
    install(app: App): void
}

declare function useVueSession(): {
    /** */
    data: Ref<object>
    /** */
    sessionId: Ref<string | number>
    instance: VueSession
}

declare module 'vue' {
    interface ComponentCustomProperties {
        sessionStorageData: SavedStorageData
        $session: VueSession
    }
}

declare module 'pinia' {
    interface PiniaCustomProperties {
        $session: VueSession
    }
}

export {

    createVueSession,
    useVueSession, VueSession
}

