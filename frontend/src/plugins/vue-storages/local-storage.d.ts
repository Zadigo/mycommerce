/*eslint no-unused-vars: "off"*/
/*eslint no-use-before-define: "off"*/

import { App, Ref } from 'vue'
import { BaseStorage, BaseStorageOptions, SavedStorageData } from './base'

interface VueLocalStorageOptions extends BaseStorageOptions {
  afterMount?: (options: { instance: VueLocalStorage }) => void
}

declare class VueLocalStorage extends BaseStorage {
  constructor(options?: VueLocalStorageOptions)

  setup(app: App): void
}

export let VueLocalStorageInstance: VueLocalStorage

declare global {
  interface Window {
    VueLocalStorage: VueLocalStorage
  }
}

declare function createVueLocalStorage(options?: VueLocalStorageOptions): {
  install(app: App): void
}

declare function useVueLocalStorage(): {
  /** */
  data: Ref<string | number | object | string[] | number[] | object[]>
  /** */
  sessionId: string | number
  instance: VueLocalStorage
}

declare module 'vue' {
  interface ComponentCustomProperties {
    localStorageData: SavedStorageData
    $localstorage: VueLocalStorage
  }
}

declare module 'pinia' {
    interface PiniaCustomProperties {
      $localstorage: VueLocalStorage
    }
}

export {
  createVueLocalStorage,
  useVueLocalStorage, VueLocalStorage
}
