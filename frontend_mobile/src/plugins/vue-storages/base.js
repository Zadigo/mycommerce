import _, { isUndefined } from 'lodash'

class BaseStorage {
  constructor (options) {
    // Three options can be passed in the options
    // value: sessionKey, initial and persistent.
    // Persistent is only for VueSession
    const defaultOptions = options || {}
    var { sessionKey, afterMount, storage } = defaultOptions
    
    this.DEFAULT_KEY_NAME = sessionKey || 'vue-storage'
    this.storage = storage
    this._history = []
    
    const existingItems = this.storage.getItem(this.DEFAULT_KEY_NAME)
    if (!existingItems) {
      const data = { sessionId: Date.now() }
      this.storage.setItem(this.DEFAULT_KEY_NAME, JSON.stringify(data))
    }

    if (!isUndefined(afterMount) && typeof afterMount === 'function') {
      afterMount.call(this, { instance: this })
    }
  }

  get data () {
    return JSON.parse(this.storage.getItem(this.DEFAULT_KEY_NAME))
  }

  _beforeSaveCheck () {
    if (!(this.DEFAULT_KEY_NAME in this.storage)) {
      const sessionData = { sessionId: Date.now() }
      this.storage.setItem(this.DEFAULT_KEY_NAME, JSON.stringify(sessionData))
    }
  }

  _save (data) {
    this._beforeSaveCheck()
    this._history.push(['save', data])
    this.storage.setItem(this.DEFAULT_KEY_NAME, JSON.stringify(data))
  }

  retrieve (key) {
    return this.data[key]
  }

  create (key, value) {
    const storedData = this.data
    storedData[key] = value
    this._save(storedData)
  }

  bulkCreate (data) {
    const storedData = this.data
    if (typeof data !== 'object') {
      return 0
    } else {
      const keys = Object.keys(data)

      _.forEach(keys, (key) => {
        storedData[key] = data[key]
      })

      this._save(storedData)
      return keys.length
    }
  }

  keyExists (key) {
    const storedData = this.data
    return Object.keys(storedData).includes(key)
  }

  remove (key) {
    const storedData = this.data
    delete storedData[key]
    this._save(storedData)
  }

  destroy () {
    this.storage.clear()
  }

  renew () {
    try {
      const storedData = this.data
      storedData.sessionId = Date.now()
      this.storage.setItem(this.DEFAULT_KEY_NAME, JSON.stringify(storedData))
      return true
    } catch {
      // Fails silently if there is no
      // session in the storage
      return false
    }
  }

  clear () {
    try {
      const sessionId = this.data.sessionId
      this.storage.setItem(this.DEFAULT_KEY_NAME, JSON.stringify({ 'sessionId': sessionId }))
      return true
    } catch {
      // Fails silently if there is no
      // session in the storage
      return false
    }
  }

  setup (app, devTools) {
    devTools(app, this)
  }
}

export {
  BaseStorage
}
