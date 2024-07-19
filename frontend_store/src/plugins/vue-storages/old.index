import { App, ComponentCustomProperties, Ref } from 'vue'
import { VueSession } from './session-storage'

// declare type DictionnaryKey = { key: string }
export type DictSetResult = [success: boolean, data: Record<string, any>]

export interface BaseOptions {
    /** The default session key (default: vue-session) */
    sessionKey?: number
    /**
     * Initial values with which the storage can be
     * populated on initilization
     */
    initial?: Record<string, any>,
    /**
     * A callback function that is executed immediately
     * after the storage session class was initialized.
     * This is useful for setting up the storage with
     * certain specific values before usage
     */
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
     * Checks if a value is null or undefined
     * 
     * @param key - key under which to check the value
     * @returns boolean
     */ 
    isEmpty(key: string): boolean
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
    listCount (key: string, raiseError: boolean = true): number
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
     * @param key Key under which to save the element
     * @param value Number, array or dictionnary
     */
    b64Create(key: string, value: string): void
    /**
     * Creates a new record and encodes it to a base 64 string
     *
     * @param key Key under which to save the element
     * @param value String to transform to b64
     */
    b64Retrieve(key: string, value: any): void
    /**
     * Gets a new record and decodes the base 64 value
     *
     * @param key Key under which to get the b64 transformed string
     */
    b64GetDelete(key: string): void
    /**
     * Gets a new record and immediately deletes it
     *
     * @param key Key under which to get the delete the b64 transformed string
     */
    create(key: string, value: any): void
    /**
     * Saves a key in the local storage with an
     * expiration date
     *
     * @param key Key to use
     * @param value Value to store
     */
    expire (key: string, value: string|number|object|number[]|string[], timeout?: number = 60): void
    /**
     * Transforms an expiration key to
     * a persistent one
     *
     * @param key key to transform
     */
    persist (key: string): void
    /**
     * Returns the value store under a given key
     *
     * @param key - key to use
     * @returns {number | string | object | number[] | string[] |object[]} The value to return
     */
    retrieve(key: string): number | string | number[] | string[]
    /**
     * Removes an element stored under a given key
     *
     * @param key Key of the element to remove
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
     * @param key Key to check existence
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
     * @param {string} key Key under which to create the value
     * @param {string | number | object | string[] | number[] | object[]} defaultValue Default element to return
     */
    getOrCreate(key: string, defaultValue: any): string | number | object | string[] | number[] | object[]
    /**
     * Tries to push the incoming element to an 
     * array stored under the given key
     *
     * @param key Key of the list under which to create a new value
     * @param value Value to add
     */
    listPush(key: string, value: any): void
    /**
     * Tries to push the incoming element to an 
     * array stored under the given key ensuring
     * that it is unique
     *
     * @param key Key of the list under which to create a new value
     * @param value Value to add
     */
    listPushUnique(key: string, value: any): void
    /**
     * Like listPush but will create a new list if it
     * does not already exist
     *
     * @param key Key under which to save the element
     * @param value Value to create
     */
    defaultList (key: string, value: any): void
    /**
     * Merges two lists under a given key
     *
     * @param key Key under which to merge the elements
     * @param values Array to merge
     */
    listMerge (key: string, values: string[] | number[] | object[]): void
    /**
     * Counts the number of items under a given list
     *
     * @param {string} key Key containing the list to count the values
     * @returns {number} Number of elements in the list
     */
    listCount (key: string): number
    /**
     * Toggle a boolean stored under a given key
     * 
     * @param {string} key Key containing the boolean to toggle
     */
    toggle(key: string): void
    /**
     * Increment a value by a certain quantity
     * 
     * @param {string} key Key under which to increment the element
     * @param {number} [number=1] k Value to increment by
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
     * @param key Key that contains the dictionnary to update
     * @param keyToUpdate Key in the dictionnary to increment
     * @param k Value to increment by
     */
    incrementDictKeyBy (key: string, keyToUpdate: string, k?: number = 1): void
    /**
     * Decrement a value by a certain quantity
     * 
     * @param {string} key Key that contains the dictionnary to update
     * @param {string} keyToUpdate Key in the dictionnary to decrement
     * @param {number} [number=1] k Value to decrement by
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
     * @param {string} key Key under which the dictionnary is located
     * @param {string} subKey Dictionnary key to set
     * @param {any} value Value to create
     */
    dictSet(key: string, subKey: string, value: any): void
    /**
     * Gets the value of a dictionnary stored under a
     * given key in the storage
     *
     * @param {string} key Storage key to get
     * @param {string} subKey Dictionnary key to get
     * @returns {any} Value to return
     */
    dictGet(key: string, subKey: string): any
    /**
     * Checks if a key exists in the underlying
     * dictionnary
     *
     * @param key Key under which to check the existence of the key
     * @param subKey Dictionnary key to check existence
     * @returns {boolean} Whether the key exists in the given dictionnary
     */
    dictExists(key: string, subKey: string): boolean
    /**
     * Clears all the entries from a dictionnary stored under a
     * given key in the storage
     *
     * @param key - dictionnary to reset under storage key
     */
    dictClear(key: string): void
    /**
     * Removes a value from a dictionnary stored under a
     * given key in the storage
     *
     * @param key - storage key to get
     * @param subKey - dictionnary key to remove
     * @returns {any} The value that was removed
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
