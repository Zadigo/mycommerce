/*
    Module that implements the localstorage in
    Vue and implements some simple functionnalities
*/

import _ from "lodash"

const DEFAULT_SETTINGS_NAME = 's'

class VueLocalStorage {
    constructor () {
        this._localStorage = localStorage
    }

    get settings() {
        return JSON.parse(this._localStorage.getItem(DEFAULT_SETTINGS_NAME))
    }

    hasSettings() {
        return !_.isNull(this._localStorage.getItem(DEFAULT_SETTINGS_NAME))
    }

    get(key) {
        return this.settings[key]
    }

    save(key, value) {
        var settings = this.settings
        settings[key] = value
        this._localStorage.setItem(JSON.stringify(settings))
    }

    clear() {
        this._localStorage.removeItem(DEFAULT_SETTINGS_NAME)
    }
}

export default VueLocalStorage
