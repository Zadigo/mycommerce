// let VueDatabaseStorage
// https://www.raymondcamden.com/2019/10/16/using-indexeddb-with-vuejs

export class VueIndexDb {
  constructor (options) {
    console.log('Called VueIndexDb')
    this.databaseName = options?.databaseName || 'vue-database'
    this.version = options?.version || 1
    this.storeName = options?.storeName || 'vue-store'
    this.addDisabled = false
    this.db = this.initializeDatabase(this.databaseName, this.storeName, this.version)
    return this.db
  }

  async initializeDatabase (databaseName, storeName, version) {
    return new Promise((resolve, reject) => {
      let db = window.indexedDB.open(databaseName, version)

      db.onerror = function (e) {
        console.error(e)
        reject(e)
      }

      db.onsuccess = function (e) {
        resolve(e.target.result)
      }

      db.onupgradeneeded = function (e) {
        console.info('Upgrade needed')
        db = e.target.result
        db.createObjectStore(storeName, { autoIncrement: true, keyPath: 'id' })
      }
    })
  }

  async create (data) {
    return new Promise((resolve) => {
      this.addDisabled = true
      
      const cursor = this.db.transaction([this.storeName], 'readWrite')
      cursor.oncomplete = function () {
        resolve()
      }

      const store = cursor.objectStore([this.storeName])
      store.add(data)

      this.addDisabled = false
    })
  }
}

export function createVueIndexDb () {
  const instance = new VueIndexDb()

  if (import.meta.env.DEV) {
    window.VueIndexDb = instance
  }

  return {
    install (app) {
      app.mixin({
        
      })
    }
  }
}
