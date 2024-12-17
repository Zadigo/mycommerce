/*!
 * vue-storages v1.0.0
 * (c) 2024 John Pendenque
 * 
 * @license MIT
 */
import { setupDevtoolsPlugin } from '@vue/devtools-api'
import { ref } from 'vue'
import { BaseStorage } from './base'

let VueLocalStorageInstance

function setupDevtools (app, storage) {
  // let devtoolsApi = null
  const devtools = {}

  setupDevtoolsPlugin({
    id: 'vue-local-storage',
    label: 'Vue Local Storage',
    packageName: 'vue-local-storage',
    homepage: 'http://example.com',
    componentStateTypes: ['vue-local-storage'],
    enableEarlyProxy: true,
    app
  }, api => {
    // devtoolsApi = api

    api.addInspector({
      id: 'vue-local-storage',
      label: 'Vue Local Storage',
      icon: 'storage'
    })

    api.on.getInspectorState((payload) => {
      if (payload.inspectorId === 'vue-local-storage') {
        payload.state = {
          state: {
            key: 'vue-local-storage',
            value: storage.data
          }
        }
      }
    })

    api.on.getInspectorTree((payload) => {
      if (payload.inspectorId === 'vue-local-storage') {
        payload.rootNodes = [
          {
            id: 'storage',
            label: 'Storage'
          }
        ]
      }
    })
  })

  return devtools
}

class VueLocalStorage extends BaseStorage {
  constructor (options) {
    super({ sessionKey: 'vue-local', storage: localStorage, ...options })
    this.storage = localStorage
  }

  setup (app) {
    super.setup(app, setupDevtools)
    app.mixin({
      data: () => ({
        localStorageData: this.data
      })
    })
  }
}

function createVueLocalStorage (options) {
  VueLocalStorageInstance = new VueLocalStorage(options)

  if (import.meta.env.DEV) {
    window.VueLocalStorage = VueLocalStorageInstance
  }

  return {
    install (app) {
      app.config.globalProperties.$localstorage = VueLocalStorageInstance
      VueLocalStorageInstance.setup(app, setupDevtools)
    }
  }
}

function useVueLocalStorage () {
  const data = ref(VueLocalStorageInstance.data)
  // const sessionId = ref(data.value.sessionId)

  return {
    data,
    // sessionId,
    instance: VueLocalStorageInstance
  }
}

export {
  createVueLocalStorage, useVueLocalStorage, VueLocalStorage, VueLocalStorageInstance
}

