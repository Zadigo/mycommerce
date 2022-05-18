// var vue = require('vue')
var { setupDevtoolsPlugin } = require('@vue/devtools-api')

function setupDevtools(app, storage) {
    let devtoolsApi = null
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
        devtoolsApi = api
        devtoolsApi
        api.addInspector({
            id: 'vue-local-storage',
            label: 'Vue Local Storage',
            icon: 'storage'
        })

        api.on.getInspectorState((payload) => {
            if (payload.inspectorId == 'vue-local-storage') {
                payload.state = {
                    state: {
                        key: 'vue-local-storage',
                        value: storage.data
                    }
                }
            }
        })

        api.on.getInspectorTree((payload) => {
            if (payload.inspectorId == 'vue-local-storage') {
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

class VueLocalStorage {
    constructor() {
        this.DEFAULT_KEY_NAME = 'vue_local'
        this.storage = localStorage
    }
    /**
     * Returns all items saved in the localStorage
     *
     * @returns dictionnary
     */
    get data() {
        var result = JSON.parse(this.storage.getItem(this.DEFAULT_KEY_NAME))

        if (!result) {
            this._save({})
            return {}
        } else {
            return result
        }
    }

    _save(data) {
        // Saves an element under the global session key
        this.storage.setItem(this.DEFAULT_KEY_NAME, JSON.stringify(data))
    }
    /**
     * Returns the value store under a given key
     *
     * @param key - key to use
     * @returns an object, a string or an array
     */
    retrieve(key) {
        // Return an item under the
        // session key
        return this.data[key]
    }
    /**
     * Creates a new record under the given key
     *
     * @param key - key under which to save the element
     * @param value - string, array or dictionnary
     * @returns null
     */
    create(key, value) {
        // Create an item under the
        // session key
        var storedData = this.data
        storedData[key] = value
        this._save(storedData)
    }
    /**
     * Removes an element stored under a given key
     *
     * @param key key of the element to remove
     * @returns null
     */
    remove(key) {
        var result = this.data
        delete result[key]
        this._save(result)
    }
    /**
     * Saves an item globally in the local storage
     *
     * @param key - key under which to save the element
     * @param value - string, array or dictionnary
     * @returns null
     */
    save(key, value) {
        // Save globally in the local storage
        // and not under the session key
        this.storage.setItem(key, value)
    }
    /**
     * Returns a value saved globally and not under the session key
     *
     * @param key - key under which to save the element
     * @returns string, array or dictionnary
     */
    getValue(key) {
        return this.storage.getItem(key)
    }

    install(app) {
        setupDevtools(app, this)
        app.config.globalProperties.$localstorage = this
        app.mixin({
            data: () => ({
                storage: this.data
            })
        })
        window.VueLocalStorage = this
    }
}

function createLocalStorage() {
    return new VueLocalStorage()
}

export {
    createLocalStorage,
    VueLocalStorage
}
