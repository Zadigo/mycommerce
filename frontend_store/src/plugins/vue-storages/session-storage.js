/*!
 * vuesession v1.0.0
 * (c) 2024 John Pendenque
 * @license MIT
 */
import { ref } from 'vue'
import { watchDeep } from '@vueuse/core'
import { setupDevtoolsPlugin } from '@vue/devtools-api'

function setupDevtools (app, storage) {
  // let trackId = 0
  let devtoolsApi
  const devtools = {}

  setupDevtoolsPlugin({
    id: 'vue-session',
    label: 'Vue Session',
    packageName: 'vue-session',
    homepage: 'http://example.com',
    componentStateTypes: ['vue-session'],
    enableEarlyProxy: true,
    app
  }, api => {
    devtoolsApi = api
    devtoolsApi
    api.addInspector({
      id: 'vue-session-storage',
      label: 'Vue Session Storage',
      icon: 'storage'
    })

    api.on.getInspectorTree((payload) => {
      if (payload.inspectorId === 'vue-session-storage') {
        payload.rootNodes = [
          {
            id: 'storage',
            label: 'Storage',
            tags: [
              {
                label: `sessionId: ${storage.DEFAULT_KEY_NAME}`,
                textColor: 0x000000,
                backgroundColor: 0xFF984F
              }
            ]
          }
        ]
      }
    })

    api.on.getInspectorState(payload => {
      if (payload.inspectorId === 'vue-session-storage') {
        payload.state = {
          'state': [
            {
              key: 'data',
              value: storage.data
            }
          ]
        }
      }
    })

    api.addTimelineLayer({
      id: 'vue-session-storage',
      label: 'VueSession',
      color: 0x92A2BF
    })

    // api.sendInspectorState('vue-session-storage')
  })

  return devtools
}

class VueSession {
  constructor(options) {
    console.debug('Vue session class called VueSession')

    const defaultOptions = options || {}
    const { sessionKey, persistent, initial } = defaultOptions

    this.storage = sessionStorage
    this._history = []

    this.DEFAULT_KEY_NAME = sessionKey || 'vue-session'

    // TODO: Implement functionnalities for persistence
    // and for implementing initial data
    this.isPersistent = persistent || false
    this.initial = initial || {}

    const existingItems = this.storage.getItem(this.DEFAULT_KEY_NAME)
    if (!existingItems) {
      const data = { sessionId: Date.now(), ...this.initial }
      this.storage.setItem(this.DEFAULT_KEY_NAME, JSON.stringify(data))
    }
  }

  get data () {
    return JSON.parse(this.storage.getItem(this.DEFAULT_KEY_NAME))
  }

  _precheck () {
    // Ensures that the session key above
    // is always present before doing any
    // operations
    if (!(this.DEFAULT_KEY_NAME in this.storage)) {
      const sessionData = { sessionId: Date.now() }
      this.storage.setItem(this.DEFAULT_KEY_NAME, JSON.stringify(sessionData))
    }
  }

  _save (data) {
    // Internal method that saves the stringified
    // data to the storage
    this._precheck()
    this._history.push(['save', data])
    this.storage.setItem(this.DEFAULT_KEY_NAME, JSON.stringify(data))
  }

  _getValueForOperation (key) {
    // Return the numeric value stored under a key
    // to run a given operation
    // var storedData = this.data
    // let result = storedData[key]
    const result = this.retrieve(key)

    if (typeof result === 'undefined') {
      return 0
    }

    if (typeof result !== 'number') {
      throw new Error('Value for increment or decrement operation should be a number')
    }
    return result
  }

  _getList (key) {
    // Returns the value of the key if the
    // item is Array otherwise raises an error
    var storedData = this.data
    const result = storedData[key]
    if (!Array.isArray(result)) {
      throw new Error('Object is not an array')
    }
    return result
  }

  b64Create (key, value) {
    const b64Value = btoa(value)
    this.create(key, b64Value)
  }

  b64Retrieve (key) {
    const result = this.retrieve(key)
    return atob(result)
  }

  b64GetDelete (key) {
    const result = this.getDelete(key)
    return atob(result)
  }

  expire (key, value, timeout = 60) {
    const currentDate = new Date
    currentDate.setSeconds(currentDate.getSeconds() + timeout)
    const data = { [`${key}`]: [value, currentDate] }
    this.create('expirations', data)
  }

  persist (key) {
    const data = this.retrieve('expirations')
    const result = data[key]
    delete data[key]
    this.create(key, result[0])
    this.create('expirations', data)
  }

  getOrExpire (key) {
    const data = this.retrieve('expirations')

    if (!data) {
      return null
    }

    if (!Object.keys(data).includes(key)) {
      return null
    }

    const value = data[key][0]
    const expirationDate = new Date(data[key][1])
    const currentDate = new Date()

    if (currentDate > expirationDate) {
      delete data[key]
      return null
    } else {
      return value
    }
  }

  getType (key) {
    return typeof this.data[key]
  }

  rename (key, newKey) {
    const data = this.data
    const oldValue = this.retrieve(key)
    delete data[key]
    this._save(data)
    this.create(newKey, oldValue)
  }

  retrieve (key) {
    return this.data[key]
  }

  create (key, value) {
    // this._precheck()
    const storedData = this.data
    storedData[key] = value
    this._save(storedData)
  }

  keyExists (key) {
    const storedData = this.data
    return Object.keys(storedData).includes(key)
  }

  isEmpty (key) {
    if (!this.keyExists(key)) {
      throw new Error(`Key "${key}" does not exists`)
    } else {
      const data = this.retrieve(key)
      if (data === null || typeof data === 'undefined') {
        return true
      } else {
        return false
      }

    }
  }

  getDelete (key) {
    let returnValue = null
    var storedData = this.data

    returnValue = storedData[key]
    delete storedData[key]

    this._save(storedData)
    return returnValue
  }

  increment (key) {
    let result = this._getValueForOperation(key)
    result = result += 1
    this.create(key, result)
  }

  decrement (key) {
    let result = this._getValueForOperation(key)
    result = result -= 1
    this.create(key, result)
  }

  incrementBy (key, k = 1) {
    let result = this._getValueForOperation(key)
    result = result += k
    this.create(key, result)
  }

  decrementBy (key, k = 1) {
    let result = this._getValueForOperation(key)
    result = result -= k
    this.create(key, result)
  }

  incrementDictKeyBy (key, keyToUpdate, k = 1) {
    const result = this.getOrCreate(key, { [`${keyToUpdate}`]: 0 })
    const dictToUpdate = result[1]
    if (typeof dictToUpdate[keyToUpdate] !== 'number') {
      dictToUpdate[keyToUpdate] = 0
      // throw new Error('Value for increment or decrement operation should be a number')
    }
    dictToUpdate[keyToUpdate] = dictToUpdate[keyToUpdate] + k
    this.create(key, dictToUpdate)
  }

  decrementDictKeyBy (key, keyToUpdate, k = 1) {
    const result = this.getOrCreate(key, { [`${keyToUpdate}`]: 0 })
    const dictToUpdate = result[1]
    if (typeof dictToUpdate[keyToUpdate] !== 'number') {
      dictToUpdate[keyToUpdate] = 0
      // throw new Error('Value for increment or decrement operation should be a number')
    }
    dictToUpdate[keyToUpdate] = dictToUpdate[keyToUpdate] - k
    this.create(key, dictToUpdate)
  }

  getOrCreate (key, value) {
    const result = this.keyExists(key)
    let returnValue = null
    let returnArray
    if (result) {
      returnValue = this.retrieve(key)
      returnArray = [false, returnValue]
    } else {
      this.create(key, value)
      returnValue = value
      returnArray = [true, returnValue]
    }
    return returnArray
  }

  listPush (key, value) {
    const result = this._getList(key)
    result.push(value)
    this.create(key, result)
  }

  listPushUnique (key, value) {
    const result = this._getList(key)
    if (!result.includes(value)) {
      result.push(value)
      this.create(key, result)
    }
  }

  defaultList (key, value) {
    if (this.keyExists(key)) {
      this.listPush(key, value)
    } else {
      this.create(key, [value])
    }
  }

  listMerge (key, values) {
    var newList = null
    const result = this._getList(key)

    if (!Array.isArray(values)) {
      throw new Error('Is not an array')
    }

    newList = [...result, ...values]
    this.create(key, newList)
  }

  listCount (key) {
    const result = this._getList(key)
    return result.length
  }

  toggle (key) {
    var result = this.retrieve(key)
    if (typeof result === 'boolean') {
      this.create(key, !result)
    } else {
      this.create(key, true)
    }
  }

  remove (key) {
    var storedData = this.data
    delete storedData[key]
    this._save(storedData)
  }

  renew () {
    // Fails silently if there is no
    // session in the storage
    try {
      const storedData = this.data
      storedData.sessionId = Date.now()
      this.storage.setItem(this.DEFAULT_KEY_NAME, JSON.stringify(storedData))
      return true
    } catch {
      return false
    }
  }

  clear () {
    // Fails silently if there is no
    // session in the storage
    try {
      const sessionId = this.data.sessionId
      this.storage.setItem(this.DEFAULT_KEY_NAME, JSON.stringify({ 'sessionId': sessionId }))
      return true
    } catch {
      return false
    }
  }

  contains (key) {
    return this.data ? key in this.data : false
  }

  destroy () {
    this.storage.clear()
  }

  dictSet (key, subKey, value) {
    const data = this.getOrCreate(key, {})
    const result = data[1]
    result[subKey] = value
    this.create(key, result)
  }

  dictGet (key, subKey) {
    const data = this.retrieve(key) || {}
    return data[subKey]
  }

  dictExists (key, subKey) {
    const data = this.retrieve(key) || {}
    return Object.keys(data).includes(subKey)
  }

  dictClear (key) {
    this.create(key, {})
  }

  dictRemove (key, subKey) {
    const data = this.retrieve(key) || {}
    const previousData = Object.assign({}, data)
    delete data[subKey]
    this.create(key, data)
    return previousData[subKey]
  }

  setup (app) {
    // Call setup() to finalize the
    // initialization for this class
    setupDevtools(app, this)
    app.mixin({
      data: () => ({
        sessionStorage: this.data
      })
    })
  }
}

// const session = new VueSession()

function createVueSession (options = {}) {
  const session = new VueSession()
  const afterMountFunction = options.afterMount

  if (typeof afterMountFunction === 'function') {
    afterMountFunction.call(session)
  }

  if (import.meta.env.DEV) {
    window.VueSession = session
  }

  return {
    install: (app) => {
      session.setup(app)
    }
  }
}

function useVueSession () {
  const session = new VueSession()
  const currentSessionData = ref(session.data)

  watchDeep(currentSessionData, (updated) => {
    console.log(updated)
  })

  return {
    currentSessionData,
    session
  }
}

export {
  useVueSession,
  createVueSession,
  VueSession
}
