/*eslint no-unused-vars: "off"*/

import { App } from 'vue'

export interface SavedStorageData {
  sessionId: number
}

export interface BaseStorageOptions {
  sessionKey?: string
  storage?: localStorage | sessionStorage
}

declare class BaseStorage {
  DEFAULT_KEY_NAME: string
  storage: localStorage | sessionStorage
  _history: [string, unknown][]

  constructor(options?: BaseStorageOptions)
  /**
   * Retrieves all items saved in the storage under the default key
   * 
   * @returns {SavedStorageData} The parsed data object stored in the storage
   * @returns {number} returns.sessionId The ID of the session
   */
  readonly data: SavedStorageData
  /**
   * Checks if the default key name exists in the storage, 
   * and initializes it with a new session ID if it doesn't. 
   */
  protected _beforeSaveCheck(): void
  /**
   * Saves the provided data to the storage under the default key name 
   * after performing necessary checks. Should not be called directly
   * see {@linkcode create} to create new key-value pairs to the stored data
   * 
   * @param {object} data - The data object to save in the storage
   */
  protected _save(data: Record<string | object, unknown>): void
  /**
   * Retrieves the value associated with the specified key from the stored data
   * 
   * @param {string} key The key of the element to retrieve from the stored data
   * @param {any | unknown} value The value associated with the key, or undefined if the key does not exist
   */
  retrieve(key: string): unknown
  /**
   * Adds a new key-value pair to the stored data and saves it
   * 
   * @param {string} key The key under which the value will be stored
   * @param {any} value The value to be stored
   */
  create(key: string, value: unknown): void
  /**
   * Adds multiple key-value pairs to the stored data and saves it
   * 
   * @param {string} key An object containing key-value pairs to be stored
   * @param {any} value The number of keys that were added to the stored data
   */
  bulkCreate(data: Record<object, unknown>): number
   /**
    * Checks if a key exists in the stored data
    * 
    * @param {string} key - The key to check for existence in the stored data
    * @returns {boolean} True if the key exists, false otherwise
    */
  keyExists(key: string): boolean
  /**
   * Removes the stored element associated with the specified key
   * 
   * @param {string} key The key of the element to delete
   */
  remove(key: string): void
  /**
   * Clears all data from the storage
   */
  destroy(): void
  /**
   * Renews the current session by updating the session ID to the current timestamp
   * 
   * @returns {boolean} True if the session ID was successfully updated, false otherwise
   */
  renew(): boolean
  /**
   * Clears all data from the storage except for the session ID
   * 
   * @returns {boolean} True if the storage was successfully cleared, false otherwise
   */
  clear(): boolean
  /***/
  setup(app: App, devTools: (app: App, storage: BaseStorage) => void): void
}

export {
  BaseStorage
}
