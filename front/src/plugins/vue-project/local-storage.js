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
        return this.data[key]
    }

    create (key, value) {
        var storedData = this.data
        storedData[key] = value
        this._save(storedData)
    }

    clear () {
        this.storage.removeItem(DEFAULT_KEY_NAME)
    }
}

export default VueLocalStorage
