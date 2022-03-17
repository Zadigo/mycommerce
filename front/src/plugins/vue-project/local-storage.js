/*
    Module that implements the localstorage in
    Vue and implements some simple functionnalities
*/

// import _ from "lodash"

const DEFAULT_KEY_NAME = 'vue_local'

class VueLocalStorage {
    constructor () {
        this.storage = localStorage
    }

    get data () {
        var result = JSON.parse(this.storage.getItem(DEFAULT_KEY_NAME))

        if (! result) {
            this._save({})
            return {}
        } else {
            return result
        }
    }

    _save (data) {
        this.storage.setItem(DEFAULT_KEY_NAME, JSON.stringify(data))
    }

    retrieve (key) {
        // Return an item under the
        // session key
        return this.data[key]
    }

    create (key, value) {
        // Create an item under the
        // session key
        var storedData = this.data
        storedData[key] = value
        this._save(storedData)
    }

    // clear () {
    //     this.storage.removeItem(DEFAULT_KEY_NAME)
    // }

    save (key, value) {
        // Save globally in the local storage
        // and not under the session key
        this.storage.setItem(key, value)
    }

    getValue (key) {
        // Return a value savd globally and
        // not under the session key
        return this.storage.getItem(key)
    }
}

export default VueLocalStorage
