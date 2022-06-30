import { setupDevtoolsPlugin } from '@vue/devtools-api'

function setupDevtools (app) {
  // let trackId = 0
  // let devtoolsApi
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
    // devtoolsApi = api

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
            label: 'Storage'
          }
        ]
      }
    })
  })

  return devtools
}

class VueSession {
  constructor (options) {
    if (!options) { options = {} }

    const { persistent, initial } = options

    this.VUE_SESSION_KEY = 'vue-session'
    this.storage = sessionStorage

    this._history = []

    // TODO: Implement functionnalities for persistence
    // and for implementing initial data
    this.isPersistent = persistent || false
    if (initial && typeof initial !== 'object') {
      throw new Error('Initial should be a dictionnary')
    }
    this.initial = initial
  }

  /**
   * Returns all items saved in the sessionStorage
   *
   * @returns dictionnary
   */
  get data () {
    return JSON.parse(this.storage.getItem(this.VUE_SESSION_KEY))
  }

  _precheck () {
    // Ensures that the session key above
    // is always present before doing any
    // operations
    if (!(this.VUE_SESSION_KEY in this.storage)) {
      const sessionData = { 'session-id': Date.now() }
      this.storage.setItem(this.VUE_SESSION_KEY, JSON.stringify(sessionData))
    }
  }

  _save (data) {
    this._precheck()
    this.storage.setItem(this.VUE_SESSION_KEY, JSON.stringify(data))
    this._history.push(['save', data])
  }

  * iter () {
    yield * Object.values(this.data)
  }

  /**
   * Creates a new record under the given global key
   *
   * @param key - key under which to save the element
   * @param value - string, array or dictionnary
   * @returns null
   */
  create (key, value) {
    this._precheck()
    const storedData = this.data
    storedData[key] = value
    this._save(storedData)
  }

  /**
   * Returns the value store under a given key
   *
   * @param key - key to use
   * @returns an object, a string or an array
   */
  retrieve (key) {
    this._precheck()
    return this.data[key]
  }

  /**
   * Removes an element stored under a given key
   *
   * @param key key of the element to remove
   * @returns null
   */
  remove (key) {
    const storedData = this.data
    delete storedData[key]
    this._save(storedData)
  }

  /**
   * Renews the session key
   */
  renew () {
    // Fails silently if there is no
    // session in the storage
    try {
      const storedData = this.data
      storedData['session-id'] = Date.now()
      this.storage.setItem(this.VUE_SESSION_KEY, JSON.stringify(storedData))
    } catch {
      return false
    }
  }

  /**
   * Clears all data stored under the global key
   */
  clear () {
    // Fails silently if there is no
    // session in the storage
    try {
      const sessionId = this.data['session-id']
      this.storage.setItem(this.VUE_SESSION_KEY, JSON.stringify({ 'session-id': sessionId }))
    } catch {
      return false
    }
  }

  /**
   * Checks whether a key exists in the storage
   *
   * @param key key of the element to remove
   * @returns Boolean
   */
  contains (key) {
    return this.data ? key in this.data : false
  }

  /**
   * Destroys the session
   */
  destroy () {
    this.storage.clear()
  }

  /**
   * Tries to get a key and eventually creates
   * a new record with the given value if it
   * does not exist
   *
   * @param key - key of the element to remove
   * @param defaultValue - key of the element to remove
   * @returns any
   */
  getOrCreate (key, defaultValue) {
    this._precheck()

    const storedData = this.data

    if (!(key in storedData)) {
      this.create(key, defaultValue)
    }

    return storedData[key]
  }

  /**
   * Tries to push the incoming an array
   * stored under a given key
   *
   * @param key - key of the element to remove
   * @param value - value to add
   */
  updateArray (key, value) {
    this._precheck()

    let result = this.data[key]

    if (!result) {
      result = []
    }
    result.push(value)

    this.create(key, result)
  }

  install (app) {
    setupDevtools(app, this)
    app.config.globalProperties.$session = this
    app.mixin({
      data: () => ({
        sessionStorage: this.data
      })
    })

    window.VueSession = this
    // if (import.meta.env.DEV) {
    // }
  }
}

function createVueSession (options) {
  return new VueSession(options)
}

export {
  createVueSession,
  VueSession
}
