/*eslint no-unused-vars: "off"*/
/*eslint no-use-before-define: "off"*/

import { App, Ref } from 'vue'
import { BaseStorage, BaseStorageOptions, storageData } from './base'

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
    protected _getList(key: string): string[] | number[] | object []
    /** */
    b64Create(key: string, value: unknown): void
    /** */
    b64Retrieve(key: string): string
    /** */
    b64GetDelete(key: string): string
    /** */
    expire(key: string, value: unknown, timeout?: number): void
    /** */
    persist(key: string): void
    /** */
    getOrExpire(key: string): unknown | null
    /** */
    getType(key: string): string
    /** */
    renameKey(key: string, newKey: string): void
    /** */
    isEmpty(key: string): boolean
    /** */
    getDelete(key: string): unknown
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
    getOrCreate(key: string, value: unknown): unknown
    /** */
    listPush(key: string, value: unknown): void
    /** */
    listPushUnique(key: string, value: unknown): void
    /** */
    defaultList(key: string, value: unknown): void
    /** */
    listMerge(key: string, values: string[] | number[] | object[]): unknown
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
    dictGet(key: string, subKey: string): unknown
    /** */
    dictExists(key: string, subKey: string): unknown
    /** */
    dictClear(key: string): void
    /** */
    dictRemove(key: string, subKey: string): unknown
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

declare module '@vue/runtime-core' {
    export interface ComponentCustomProperties {
        sessionStorageData: storageData
        $session: VueSession
    }
}

declare module 'pinia' {
    export interface PiniaCustomProperties {
        $session: VueSession
    }
}

export {

    createVueSession,
    useVueSession, VueSession
}

