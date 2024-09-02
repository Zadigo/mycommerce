/*eslint no-unused-vars: "off"*/
/*eslint no-use-before-define: "off"*/

import { App, Ref } from 'vue'
import { BaseStorage, BaseStorageOptions, storageData } from './base'

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
  data: Ref<object>
  /** */
  sessionId: Ref<string | number>
  instance: VueLocalStorage
}

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    localStorageData: storageData
    $localstorage: VueLocalStorage
  }
}

declare module 'pinia' {
    export interface PiniaCustomProperties {
        $localstorage: VueLocalStorage
    }
}

export {
  createVueLocalStorage,
  useVueLocalStorage, VueLocalStorage
}
