import { App, ComponentCustomProperties, Ref } from 'vue'
import { VueSession } from './session-storage'

// declare type DictionnaryKey = { key: string }
export type DictSetResult = [success: boolean, data: Record<string, any>]

export interface BaseOptions {
    /** The default session key (default: vue-session) */
    sessionKey?: number
    /** Initial values with which to initialize the storage */
    initial?: Record<string, any>,
    /** A function to run after the storage is initialized */
    afterMount?: ((this: VueSession, ...args: any[]) => void) | null
}

/** 
 * VueLocalStorage allows serializing and deserializing
 * data in the base Window locale storage
 */
export declare interface VueLocalStorage {
    /** The default session key (defaults: vue-session) */
    readonly DEFAULT_KEY_NAME: string
    /**
     * Returns all items saved in the localStorage
     *
     * @returns dictionnary
     */
    readonly data: object

    constructor(options?: BaseOptions): void
    /**
     * Returns the value store under a given key
     *
     * @param key - key to use
     * @returns an object, a number or an array
     */
    retrieve (key: string): object | string | number
    /**
     * Creates a new record under the given key
     *
     * @param key - key under which to save the element
     * @param value - number, array or dictionnary
     * @returns null
     */
    create(key: string, value: any): void
    /**
     * Checks if a value exists in a dictionnary
     * 
     * @param key - key under which to save the element
     * @returns boolean
     */ 
    keyExists(key: string): boolean
    /**
     * Gets a value and immediately deletes it
     * 
     * @param key - key under which to save the element
     * @returns any
     */
    getDelete(key: string): any
    /**
     * Increment a value by one
     * 
     * @param key - key under which to increment the element
     * @returns null
     */
    increment (key: string): void
    /**
     * Decrement a value by one
     * 
     *  @param key - key under which to decrement the element
     *  @returns null
     */
    decrement (key: string): void
    /**
     * Removes an element stored under a given key
     *
     * @param key key of the element to remove
     * @returns null
     */
    remove(key: string): void
    /**
     * Increment a value by a certain quantity
     * 
     * @param key - key under which to increment the element
     * @param k - value to increment by
     * @returns null
     */
    incrementBy (key: string, k?: number = 1): void
    /**
     * Decrement a value by a certain quantity
     * 
     * @param key - key under which to increment the element
     * @param k - value to decrement by
     * @returns null
     */
    decrementBy (key: string, k?: number = 1): void
    /**
     * Gets or creates a new value if it does not exist
     *
     * @param key - key under which to save the element
     * @param value - number, array or dictionnary
     * @returns any
     */
    getOrCreate (key: string, value: any): DictSetResult
    /**
     * Pushes a value in a list
     *
     * @param key - key under which to save the element
     * @param value - number, array or dictionnary
     * @returns null
     */
    listPush (key: string, value: any): void
    /**
     * Pushes a value in a list only if it does not already exist
     *
     * @param key - key under which to save the element
     * @param value - number, array or dictionnary
     * @returns null
     */
    listPushUnique (key: string, value: any): void
    /**
     * Like listPush but will create a new list if it
     * does not already exist
     *
     * @param key - key under which to save the element
     * @param value - number, array or dictionnary
     * @returns null
     */
    defaultList (key: string, value: any): void
    /**
     * Merges two lists under a given key
     *
     * @param key - key under which to merge the elements
     * @param values - array to merge
     * @returns null
     */
    listMerge (key: string, values: object): void
    /**
     * Counts the number of items under a given list
     *
     * @param key - key under which to merge the elements
     * @returns number
     */
    listCount (key: string): number
    /**
     * Toggles a value under a given key
     *
     * @param key - key under which to toggle the boolean value
     * @returns null
     */
    toggle(key: string): void
    
    install(app: App): void
}

/** Possible options for VueSession */
export declare interface VueSessionOptions extends BaseOptions {
    /** Persist the data in the local storage */
    persistent?: boolean
}

/** 
 * VueSession allows serializing and deserializing
 * data easily in the base Window session storage
 */
export declare interface VueSession {
    // dictSetResult: [boolean, object]

    /** The default session key (defaults: vue-session) */
    readonly DEFAULT_KEY_NAME: string
    /**
     * Returns all items saved in the storage
     *
     * @returns dictionnary
     */
    readonly data: object

    constructor(options?: VueSessionOptions): void
    /**
     * Creates a new record under the given global key
     *
     * @param key - key under which to save the element
     * @param value - number, array or dictionnary
     * @returns null
     */
    b64Create(key: string, value: string): void
    /**
     * Creates a new record and encodes it to a base 64 string
     *
     * @param key - key under which to save the element
     * @param value - string
     * @returns null
     */
    b64Retrieve(key: string, value: any): void
    /**
     * Gets a new record and decodes the base 64 value
     *
     * @param key - key under which to get the element
     * @returns null
     */
    b64GetDelete(key: string): void
    /**
     * Gets a new record and immediately deletes it
     *
     * @param key - key under which to get the element
     * @returns string
     */
    create(key: string, value: any): void
    /**
     * Saves a key in the local storage with an
     * expiration date
     *
     * @param key key to use
     * @param value value to store
     * @returns null
     */
    expire (key: string, value: string|number|object|number[]|string[], timeout?: number = 60): void
    /**
     * Transforms an expiration key to
     * a persistent one
     *
     * @param key key to transform
     * @returns null
     */
    persist (key: string): void
    /**
     * Returns the value store under a given key
     *
     * @param key - key to use
     * @returns an object, a number or an array
     */
    retrieve(key: string): number | string | number[] | string[]
    /**
     * Removes an element stored under a given key
     *
     * @param key key of the element to remove
     * @returns null
     */
    remove(key: string): void
    /**
     * Renews the session key
     */
    renew(): void
    /**
     * Clears all data stored under the global key
     */
    clear(): void
    /**
     * Checks whether a key exists in the storage
     *
     * @param key key of the element to remove
     * @returns Boolean
     */
    contains(key: string): boolean
    /**
     * Destroys the session
     */
    destroy(): void
    /**
     * Tries to get a key and eventually creates
     * a new record with the given value if it
     * does not exist
     *
     * @param key - key of the element to remove
     * @param defaultValue - key of the element to remove
     */
    getOrCreate(key: string, defaultValue: any): number | object
    /**
     * Tries to push the incoming element to an 
     * array stored under the given key
     *
     * @param key - key of the element to remove
     * @param value - value to add
     */
    listPush(key: string, value: any): void
    /**
     * Tries to push the incoming element to an 
     * array stored under the given key ensuring
     * that it is unique
     *
     * @param key - key of the element to remove
     * @param value - value to add
     */
    listPushUnique(key: string, value: any): void
    /**
     * Like listPush but will create a new list if it
     * does not already exist
     *
     * @param key - key under which to save the element
     * @param value - number, array or dictionnary
     * @returns null
     */
    defaultList (key: string, value: any): void
    /**
     * Merges two lists under a given key
     *
     * @param key - key under which to merge the elements
     * @param values - array to merge
     * @returns null
     */
    listMerge (key: string, values: object): void
    /**
     * Counts the number of items under a given list
     *
     * @param key - key under which to merge the elements
     * @returns number
     */
    listCount (key: string): number
    /**
     * Toggle a boolean stored under a given key
     * 
     * @param key - key of the element to toggle
     */
    toggle(key: string): void
    /**
     * Increment a value by a certain quantity
     * 
     * @param key - key under which to increment the element
     * @param k - value to increment by
     * @returns null
     */
    incrementBy (key: string, k?: number = 1): void
    /**
     * Decrement a value by a certain quantity
     * 
     * @param key - key under which to increment the element
     * @param k - value to decrement by
     * @returns null
     */
    decrementBy (key: string, k?: number = 1): void
    /**
     * Increment a value by a certain quantity
     * 
     * @param key - key that contains the dictionnary to update
     * @param keyToUpdate - key in the dictionnary to increment
     * @param k - value to increment by
     * @returns null
     */
    incrementDictKeyBy (key: string, keyToUpdate: string, k?: number = 1): void
    /**
     * Decrement a value by a certain quantity
     * 
     * @param key - key that contains the dictionnary to update
     * @param keyToUpdate - key in the dictionnary to decrement
     * @param k - value to decrement by
     * @returns null
     */
    decrementDictKeyBy (key: string, keyToUpdate: string, k?: number = 1): void
    /**
     * Gets the type of the value
     * 
     * @param key - key that contains the value to check
     * @returns null
     */
    getType (key: string): string
    /**
     * Sets the value of a dictionnary stored under a
     * given key in the storage
     *
     * @param key - key under which the dictionnary is located
     * @param subKey - dictionnary key to set
     * @param value - value to create
     * @returns null
     */
    dictSet(key: string, subKey: string, value: any): void
    /**
     * Gets the value of a dictionnary stored under a
     * given key in the storage
     *
     * @param key - storage key to get
     * @param subKey - dictionnary key to get
     * @returns any
     */
    dictGet(key: string, subKey: string): any
    /**
     * Checks if a key exists in the underlying
     * dictionnary
     *
     * @param key - storage key to get
     * @param subKey - dictionnary key to check
     * @returns boolean
     */
    dictExists(key: string, subKey: string): boolean
    /**
     * Clears all the entries from a dictionnary stored under a
     * given key in the storage
     *
     * @param key - dictionnary to reset under storage key
     * @returns null
     */
    dictClear(key: string): void
    /**
     * Removes a value from a dictionnary stored under a
     * given key in the storage
     *
     * @param key - storage key to get
     * @param subKey - dictionnary key to remove
     * @returns any
     */
    dictRemove(key: string, subKey: string): any

    setup(app: App): void
}

/** Creates a VueLocalStorage instance that can be used by a Vue app */
export function createVueLocalStorage(options: BaseOptions | undefined): VueLocalStorage

/** Creates a VueSession instance that can be used by a Vue app */
export function createVueSession(options?: VueSessionOptions): VueSession

export const session: VueSession

/**
 * Represents a composable that provides access 
 * to a Vue session data
 * 
 */
export declare function useVueSession (): {
    /**
     * Reference to the application storage 
     * containing session data
     */
    currentSessionData: Ref<object>
    /**
     * Instance of VueSession for managing 
     * session data
     */
    session: VueSession
}

declare module '@vue/runtime-core' {
    export interface ComponentCustomProperties {
        /** Current data saved under the VUE_SESSION_KEY */
        localStorage: Record<string, any>
        /** Current data saved under VUE_SESSION_KEY */
        sessionStorage: Record<string, any>
        /** The VueLocalStorage instance */
        $localstorage: VueLocalStorage
        /** The VueSession instance */
        $session: VueSession
    }
}
