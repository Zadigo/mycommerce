const DEFAULT_KEY_NAME = 'vue_local'


class VueLocalStorage {
    constructor() {
        this.storage = localStorage
    }

    get data() {
        var result = JSON.parse(this.storage.getItem(DEFAULT_KEY_NAME))

        if (!result) {
            this._save({})
            return {}
        } else {
            return result
        }
    }

    _save(data) {
        // Saves an element under the global session
        // key name above
        this.storage.setItem(DEFAULT_KEY_NAME, JSON.stringify(data))
    }

    retrieve(key) {
        // Return an item under the
        // session key
        return this.data[key]
    }

    create(key, value) {
        // Create an item under the
        // session key
        var storedData = this.data
        storedData[key] = value
        this._save(storedData)
    }

    remove(key) {
        var result = this.data
        delete result[key]
        this._save(result)
    }

    save(key, value) {
        // Save globally in the local storage
        // and not under the session key
        this.storage.setItem(key, value)
    }

    getValue(key) {
        // Return a value saved globally and
        // not under the session key
        return this.storage.getItem(key)
    }

    install(app) {
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
    DEFAULT_KEY_NAME,
    createLocalStorage
}