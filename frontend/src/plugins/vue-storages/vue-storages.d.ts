import { createLocalStorage, VueLocalStorage } from "./local-storage";
import { App, ComponentCustomProperties, Ref } from 'vue'
import { VueSession, createVueSession } from './session-storage'

declare type DictionnaryKey = string

/**
 * Creates a VueLocalStorage instance that can be used by a Vue app
 *
 */
export declare function createLocalStorage(): VueLocalStorage

/**
 * VueLocalStorage instance
 */
export declare interface VueLocalStorage {
    /**
     * @internal
     */
    DEFAULT_KEY_NAME: string
    storage: Ref<localStorage>

    get data(): any
    _save(data: any): void
    retrieve(key: DictionnaryKey): Object
    create(key: DictionnaryKey, value: any): void
    remove(key: DictionnaryKey): void
    save(key: DictionnaryKey, value: any): void
    getValue(key: DictionnaryKey): any
    install(app: App): void
}

export interface ComponentCustomProperties {
    /**
     * {@link VueLocalStorage} instance used by the application
     */
    $localstorage: VueLocalStorage
}

/**
 * VueSessionStorage instance
 */
export declare interface VueSessionStorage {
    /**
     * @internal
     */
    VUE_SESSION_KEY: string
    storage: Ref<sessionStorage>

    get data(): any
    _save(data: any): void
    create(key: DictionnaryKey, value: any): void
    retrieve(key: DictionnaryKey): Object
    remove(key: DictionnaryKey): void
    renew(): void
    clear(): void
    contains(key: DictionnaryKey): Boolean
    destroy(): any
    getOrCreate(key: DictionnaryKey, defaultValue: any): any
    install(app: App): void
}

export interface ComponentCustomProperties {
    /**
     * {@link VueSession} instance used by the application
     */
    $session: VueSession
}

